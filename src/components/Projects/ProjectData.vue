<template>
  <div>
    Enter data here. This will be different for every project. Lots of workflow logic in this
    component. This component should select and display one or more sub-components based on the
    project type.
  </div>
  <ul>
    <li>LS jobs: Certification Datasheet</li>
    <li>
      IS jobs: Inspection Checklist (How to determine which one? Need a inspection-specific field
      for Inspection Type, will function similar to standards for testing projects)
    </li>
    <li>
      TS jobs: Datasheets for each standard assigned to the project (Any other common data? This
      should go first before individual standards)
    </li>
  </ul>
  <div>
    Each sub-component should contain a form to collect data, probably some instructional text (like
    existing datasheet attempts), and then a button at the end to submit. The button should be
    disabled if any required fields are empty. Hitting the active button should fill in some logical
    field (dataEnteredDate?), which will be used as the signal to enable deliverable generation, and
    also lock editing of the data.
  </div>
  <div>So, project records need a new field, which might be an array. Or a join table?</div>
  <div>
    If changes need to be made, there needs to be a data revision process, which will record the
    user and date related to the change, and then enable generation of a revised deliverable. No
    casual edits past a certain point.
  </div>
</template>

<style scoped>
div,
ul {
  padding-top: 10px;
}
</style>
