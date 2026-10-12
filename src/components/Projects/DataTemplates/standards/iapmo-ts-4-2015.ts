import type { FieldOption, Limit, StandardTemplate, UnitSystem, Values } from './types';

// Section text is reproduced from IAPMO TS 4-2015 for reference while testing (internal use
// under TEi's license for the standard).

const MATERIALS: FieldOption[] = [
  { label: 'Aluminum alloy (5050, 5052, 5086, 6061 or better)', value: 'aluminum' },
  { label: 'Copper alloy', value: 'copper' },
  { label: 'Silicone bronze', value: 'silicone-bronze' },
  { label: 'Carbon steel', value: 'carbon-steel' },
  { label: 'Galvanized steel', value: 'galvanized' },
  { label: 'Stainless steel, 300 series', value: 'stainless' },
  { label: 'Plastic', value: 'plastic' },
  { label: 'Other (not listed in 4.2.1)', value: 'other', fails: true },
];

const isPressure = (i: Values) => i.tankType === 'pressure';
const isPlastic = (i: Values) => i.material === 'plastic';
const isCopperOrBronze = (i: Values) => i.material === 'copper' || i.material === 'silicone-bronze';

// The standard's own values in each unit system
const both = (units: UnitSystem, metric: Limit, imperial: Limit) =>
  units === 'metric' ? metric : imperial;

const pressureUnit = (units: UnitSystem) => (units === 'metric' ? 'kPa' : 'psi');

// Limit as a multiple of the working pressure, which is entered in the sheet's units
function timesWorkingPressure(i: Values, units: UnitSystem, factor: number): Limit | null {
  const wp = Number(i.workingPressure) || 0;
  if (!wp) return null;
  const min = Math.round(wp * factor * 100) / 100;
  const unit = pressureUnit(units);
  return { min, text: `≥ ${min} ${unit} (${factor} × ${wp} ${unit})` };
}

// 4.3 minimum wall thickness by material
function minWallThickness(i: Values, units: UnitSystem): Limit | null {
  const limit = (mm: number, inches: number) =>
    both(units, { min: mm, text: `≥ ${mm} mm` }, { min: inches, text: `≥ ${inches} in` });
  switch (i.material) {
    case 'aluminum':
      return limit(0.503, 0.0198);
    case 'copper':
    case 'silicone-bronze':
      return i.tankShape === 'square' ? limit(1.168, 0.046) : limit(0.889, 0.035);
    case 'carbon-steel':
      return limit(0.787, 0.031);
    case 'galvanized':
    case 'stainless':
      return limit(0.406, 0.016);
    default:
      return null;
  }
}

const template: StandardTemplate = {
  key: 'iapmo-ts-4-2015',
  standardNumber: 'IAPMO TS 4',
  revision: '2015',

  inputs: [
    {
      key: 'tankType',
      label: 'Tank Type',
      type: 'select',
      options: [
        { label: 'Non-pressure', value: 'non-pressure' },
        { label: 'Pressure', value: 'pressure' },
      ],
    },
    {
      key: 'material',
      label: 'Tank material (4.2.1)',
      type: 'select',
      options: MATERIALS,
      section: '4.2',
    },
    {
      key: 'tankShape',
      label: 'Tank shape',
      type: 'select',
      options: [
        { label: 'Round', value: 'round' },
        { label: 'Square', value: 'square' },
      ],
      showIf: isCopperOrBronze,
      section: '4.3',
    },
    {
      key: 'collapsible',
      label: 'Collapsible tank?',
      type: 'yesno',
      showIf: (i) => i.tankType === 'non-pressure',
      section: '4.5',
    },
    {
      key: 'workingPressure',
      label: 'Max. Rated Working Pressure',
      type: 'number',
      quantity: 'pressure',
      showIf: isPressure,
    },
  ],

  clauses: [
    {
      number: '4.1',
      title: 'General',
      text: `4.1 General

4.1.1 Tanks shall have smooth interior surfaces, without concealed fouling areas, to ensure ease of cleaning.

4.1.2 Tanks and their points of support shall be capable of withstanding shock and vibration due to vehicular movement while on the road.`,
      fields: [
        {
          key: 'smoothInterior',
          label: 'Smooth interior, no concealed fouling areas',
          type: 'requirement',
        },
        {
          key: 'shockVibration',
          label: 'Tank and supports withstand road shock and vibration',
          type: 'requirement',
        },
      ],
    },
    {
      number: '4.2',
      title: 'Materials',
      text: `4.2 Materials

4.2.1 Tanks shall be made of
  (a) aluminum alloys complying with or exceeding the properties 5050, 5052, 5086, or 6061 alloys;
  (b) copper alloys;
  (c) silicone bronze;
  (d) carbon steel;
  (e) galvanized steel;
  (f) stainless steel alloys of the 300 series; or
  (g) plastics.

4.2.2 Tanks made of galvanized steel or aluminum alloys shall have their interior coated with a non-soluble rust inhibitor. Tanks made of carbon steel shall be lined with plastic.`,
      fields: [
        {
          key: 'rustInhibitor',
          label: 'Interior coated with non-soluble rust inhibitor',
          type: 'requirement',
          showIf: (i) => i.material === 'galvanized' || i.material === 'aluminum',
        },
        {
          key: 'plasticLining',
          label: 'Interior lined with plastic',
          type: 'requirement',
          showIf: (i) => i.material === 'carbon-steel',
        },
      ],
    },
    {
      number: '4.3',
      title: 'Wall Thicknesses',
      text: `4.3 Wall Thicknesses
Minimum wall thicknesses for tanks made of
  (a) aluminum alloys shall be 0.503 mm (0.0198 in);
  (b) copper alloys or silicone bronze shall be
      (i) 0.889 mm (0.0350 in), for round tanks; or
      (ii) 1.168 mm (0.0460 in), for square tanks;
  (c) carbon steel shall be 0.787 mm (0.031 in);
  (d) galvanized steel shall be 0.406 mm (0.0160 in); and
  (e) stainless steel alloys shall be 0.406 mm (0.0160 in.).`,
      notApplicable: (i) => (isPlastic(i) ? 'Not applicable to plastic tanks' : null),
      isTest: true,
      fields: [
        {
          key: 'minThickness',
          label: 'Minimum measured wall thickness',
          type: 'number',
          quantity: 'length',
          limit: (i, _, u) => minWallThickness(i, u),
        },
      ],
    },
    {
      number: '4.4',
      title: 'Outlets',
      text: `4.4 Outlets
Tanks shall have an outlet located so that the water retained is not deeper than 10 mm (0.38 in) when connected to the piping. For tanks with a capacity greater than 115 L (30 gal), the outlet shall be at least IPS-1/2.`,
      fields: [
        {
          key: 'retainedWaterOk',
          label: 'Retained water no deeper than 10 mm (0.38 in)',
          type: 'requirement',
        },
        {
          key: 'retainedDepth',
          label: 'Measured retained water depth',
          type: 'number',
          quantity: 'length',
          optional: true,
          limit: (_, __, u) =>
            both(u, { max: 10, text: '≤ 10 mm' }, { max: 0.38, text: '≤ 0.38 in' }),
        },
        {
          key: 'outletSizeOk',
          label: 'Outlet at least IPS-1/2 (tanks over 115 L (30 gal) only)',
          type: 'requirement',
          allowNA: true,
        },
      ],
    },
    {
      number: '4.5',
      title: 'Venting',
      text: `4.5 Venting

4.5.1 Except for collapsible tanks, non-pressure tanks shall be vented to the atmosphere.

4.5.2 Vent openings shall have a means of
  (a) being watertight and weatherproof;
  (b) preventing access by vermin; and
  (c) preventing entry of foreign materials and substances.`,
      notApplicable: (i) => {
        if (isPressure(i)) return 'Not applicable to pressure tanks';
        if (i.collapsible === 'yes') return 'Not applicable to collapsible tanks';
        return null;
      },
      fields: [
        { key: 'vented', label: 'Vented to atmosphere', type: 'requirement' },
        { key: 'watertight', label: 'Vent watertight and weatherproof', type: 'requirement' },
        { key: 'vermin', label: 'Vent prevents access by vermin', type: 'requirement' },
        {
          key: 'foreignMatter',
          label: 'Vent prevents entry of foreign materials',
          type: 'requirement',
        },
      ],
    },
    {
      number: '4.6',
      title: 'Toxicity',
      text: `4.6 Toxicity

4.6.1 Materials and components of pressure and non-pressure water tanks for use in recreational vehicles intended to convey or dispense water for human consumption through drinking or cooking shall comply with the applicable requirements of NSF/ANSI 61.

4.6.2 Solder and fluxes in contact with potable water shall not exceed, by mass, 0.2% lead content.`,
      fields: [
        { key: 'nsf61', label: 'Materials comply with NSF/ANSI 61', type: 'requirement' },
        {
          key: 'leadFree',
          label: 'Solder and flux in contact with water ≤ 0.2% lead',
          type: 'requirement',
          allowNA: true,
        },
      ],
    },
    {
      number: '5.1',
      title: 'Pressure Test for Non-Pressure Tanks',
      text: `5.1 Pressure Test for Non-Pressure Tanks

5.1.1 General
The pressure test shall be conducted only on tanks intended for non-pressure applications, in accordance with one of the test procedures specifies in Sections 5.1.2 to 5.1.4.

5.1.2 Water Column Test Procedure
The water column test shall be conducted as follows:
  (a) Mount and level the tank on a rack, in accordance with the manufacturer's installation instructions.
  (b) Insert a standpipe at least 760 mm (30 in) long in the uppermost vent opening.
  (c) Cap or plug all other openings.
  (d) Fill the tank with water to a height of 700.0 mm (27.56 in) in the standpipe.
      Note: A pressure of 6.9 kPa (1 psi) is equivalent to a water column 700.0 mm (27.56 in) tall.
  (e) Maintain the water column for at least 1 min.
  (f) Observe the tank for leaks.

5.1.3 Submerged Test Procedure
The submerged test shall be conducted as follows:
  (a) Cap or plug all tank outlets except one.
  (b) Attach an air hose and a pressure gauge, accurate to at least 1 kPa (0.25 psi), to the remaining tank outlet.
  (c) Apply a pressure of 6.9 kPa (1 psi).
  (d) Submerge the tank in water.
  (e) Hold the tank under water for at least 1 min while observing for air bubbles

5.1.4 Mass Flow Test Procedure
The mass flow test shall be conducted as follows:
  (a) Cap or plug all the outlets of the tank except one.
  (b) Attach an air hose from the mass flow test panel to the remaining tank outlet. The mass flow test panel shall be capable of measuring pressure loss or flow rate with an accuracy of at least 100 Pa (0.01 psi) or 1 mL/min, respectively.
      Note: The mass flow test panel is a test apparatus capable of supplying pressure to the test specimens for the prescribed time period and measuring pressure drop or flow rate.
  (c) Apply a pressure of 6.9 kPa (1 psi).
  (d) Hold the pressure for at least 1 min while monitoring the test panel for any loss of air pressure.

5.1.5 Performance Requirements
There shall be no leakage of water, air bubbles from the submerged tank, or loss of pressure.`,
      notApplicable: (i) => (isPressure(i) ? 'Not applicable to pressure tanks' : null),
      isTest: true,
      fields: [
        {
          key: 'method',
          label: 'Test method',
          type: 'select',
          shared: true,
          options: [
            { label: '5.1.2 Water column', value: 'water-column' },
            { label: '5.1.3 Submerged', value: 'submerged' },
            { label: '5.1.4 Mass flow', value: 'mass-flow' },
          ],
        },
        {
          key: 'columnHeight',
          label: 'Water column height',
          type: 'number',
          quantity: 'length',
          showIf: (_, v) => v.method === 'water-column',
          limit: (_, __, u) =>
            both(u, { min: 700, text: '≥ 700 mm' }, { min: 27.56, text: '≥ 27.56 in' }),
        },
        {
          key: 'testPressure',
          label: 'Test pressure',
          type: 'number',
          quantity: 'pressure',
          showIf: (_, v) => v.method === 'submerged' || v.method === 'mass-flow',
          limit: (_, __, u) =>
            both(u, { min: 6.9, text: '≥ 6.9 kPa' }, { min: 1, text: '≥ 1 psi' }),
        },
        {
          key: 'duration',
          label: 'Duration',
          type: 'number',
          unit: 'min',
          limit: () => ({ min: 1, text: '≥ 1 min' }),
        },
        {
          key: 'leakage',
          label: 'No leakage, air bubbles, or loss of pressure',
          type: 'requirement',
        },
      ],
    },
    {
      number: '5.2',
      title: 'Hydrostatic Pressure Test for Pressure Tanks',
      text: `5.2 Hydrostatic Pressure Test for Pressure Tanks

5.2.1 Test Procedure for Plastic Tanks
The hydrostatic pressure test for plastic tanks intended for pressure applications shall be conducted as follows:
  (a) Apply a pressure of at least 1,380 kPa (200 psi).
  (b) Maintain the pressure for 15 min.

5.2.2 Test Procedure for Tanks Made of Materials Other Than Plastic
The hydrostatic pressure test for tanks intended for pressure applications and made of materials other than plastic shall be conducted as follows:
  (a) Apply a pressure equivalent to at least
      (i) 1.5 times the working pressure of the tank, for hydrostatic testing; or
      (ii) 1.25 times the working pressure of the tank, for pneumatic testing.
  (b) Maintain the pressure for 15 min.

5.2.3 Performance Requirements
There shall be no leakage of water or loss of pressure.`,
      notApplicable: (i) => (isPressure(i) ? null : 'Not applicable to non-pressure tanks'),
      isTest: true,
      fields: [
        {
          key: 'method',
          label: 'Test method',
          type: 'select',
          shared: true,
          options: [
            { label: 'Hydrostatic', value: 'hydrostatic' },
            { label: 'Pneumatic', value: 'pneumatic' },
          ],
          showIf: (i) => !isPlastic(i),
        },
        {
          key: 'testPressure',
          label: 'Test pressure',
          type: 'number',
          quantity: 'pressure',
          limit: (i, v, u) => {
            if (isPlastic(i)) {
              return both(u, { min: 1380, text: '≥ 1,380 kPa' }, { min: 200, text: '≥ 200 psi' });
            }
            return timesWorkingPressure(i, u, v.method === 'pneumatic' ? 1.25 : 1.5);
          },
        },
        {
          key: 'duration',
          label: 'Duration',
          type: 'number',
          unit: 'min',
          limit: () => ({ min: 15, text: '≥ 15 min' }),
        },
        { key: 'leakage', label: 'No leakage or loss of pressure', type: 'requirement' },
      ],
    },
    {
      number: '5.3',
      title: 'Burst Pressure Test for Metallic Pressure Tanks',
      text: `5.3 Burst Pressure Test for Metallic Pressure Tanks

5.3.1 Test Procedure
The burst pressure test for tanks intended for pressure applications and made of materials other than plastic (i.e., metallic tanks), shall be conducted as follows:
  (a) Apply a pressure equivalent to at least 3 times the working pressure of the tank.
  (b) Maintain the pressure for 1 min.

5.3.2 Performance Requirements
There shall be no leakage or loss of pressure.`,
      notApplicable: (i) => {
        if (!isPressure(i)) return 'Not applicable to non-pressure tanks';
        if (isPlastic(i)) return 'Not applicable to non-metallic tanks';
        return null;
      },
      isTest: true,
      fields: [
        {
          key: 'testPressure',
          label: 'Test pressure',
          type: 'number',
          quantity: 'pressure',
          limit: (i, _, u) => timesWorkingPressure(i, u, 3),
        },
        {
          key: 'duration',
          label: 'Duration',
          type: 'number',
          unit: 'min',
          limit: () => ({ min: 1, text: '≥ 1 min' }),
        },
        { key: 'leakage', label: 'No leakage or loss of pressure', type: 'requirement' },
      ],
    },
    {
      number: '6',
      title: 'Markings',
      text: `6 Markings

6.1 Water tanks complying with this Standard shall be marked with the
  (a) manufacturer's name or trademark;
  (b) model number; and
  (c) maximum rated working pressure at 23 ºC (73ºF), for pressure tanks only.

6.2 Markings shall be permanent, legible, and visible after installation.`,
      fields: [
        { key: 'name', label: "Manufacturer's name or trademark", type: 'requirement' },
        { key: 'model', label: 'Model number', type: 'requirement' },
        {
          key: 'pressureRating',
          label: 'Max. rated working pressure at 23 °C (73 °F)',
          type: 'requirement',
          showIf: isPressure,
        },
        {
          key: 'permanent',
          label: 'Permanent, legible, and visible after installation',
          type: 'requirement',
        },
      ],
    },
  ],
};

export default template;
