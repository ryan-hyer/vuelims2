<template>
  <div>
    Enter data here. This will be different for every project type. Lots of workflow logic in this
    component. This component should select and display one or more sub-components based on the
    project type.
  </div>
  <ul>
    <li>LS jobs: Certification Datasheet</li>
    <li>IS jobs: Inspection Checklist, depending on the inspection type selected</li>
    <li>TS jobs:</li>
    <ul>
      <li>Need sample information, also a page somewhere for sample receipt</li>
      <li>Datasheets for each standard assigned to the project</li>
      <li>
        Also all the fields we removed from the new application form: manufacturer, sample
        information, sampling date, sampling plan, sample location - all that stuff that needs to be
        on the report
      </li>
    </ul>
  </ul>
  <div>
    Each sub-component should contain a form to collect data, probably some instructional text (like
    existing datasheet attempts), and then a couple of buttons at the end: one to Save, and another
    to Complete and LOCK the data. The Lock button should be disabled if any required fields are
    empty. Hitting the button should fill in some logical field (dataEnteredDate?), which will be
    used as the signal to enable deliverable generation, and also prevent further editing of the
    data.
  </div>
  <div>
    If changes to data need to be made, there needs to be a data revision process, which will record
    the user and date related to the change, and then enable generation of a revised deliverable. No
    casual edits after a deliverable has been generated.
  </div>
</template>

<style scoped>
div {
  padding-bottom: 10px;
}
</style>
