<template>
  <q-page padding>
    <div class="page-header">Dashboard</div>

    <div>
      <p class="text-h6 q-pt-md">App Completion Status:</p>

      <div class="text-bold">Overall</div>
      <q-linear-progress size="25px" color="accent" :value="complete.overall / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.overall + '%'" />
        </div>
      </q-linear-progress>
      <ul>
        <li>
          Need to make some design decisions around things like customers -- a single large
          customers page that can be filtered by job type? Or a separate page for customers by job
          type?
        </li>
        <li>
          Same with listings: Do I have a separate structure just for listing, like I do with the
          Tracker, or do I just integrate listing-specific info into the existing customer/project
          structure?
        </li>
        <li>
          Also think about how this all might integrate with a new public site, things like library
          check-out and return, access to completed reports, application process, submitting
          payments, etc.
        </li>
        <li>
          Might be helpful to have each module have its own color, then use that as the accent color
          throughout those pages, kind of like the internal audit
        </li>
      </ul>

      <div class="text-bold">Authentication and Authorization</div>
      <q-linear-progress size="25px" color="accent" :value="complete.auth / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.auth + '%'" />
        </div>
      </q-linear-progress>
      <ul>
        <li>Just need to make sure role guards are implemented where needed</li>
        <li>
          Some functions should be available to any of an employee's supervisors, as well as admins
          (e.g. performance reviews)
        </li>
        <li>
          And also flesh out the user Profile page, notifications, messages and stuff like that
        </li>
      </ul>

      <div class="text-bold">Projects</div>
      <q-linear-progress size="25px" color="accent" :value="complete.projects / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.projects + '%'" />
        </div>
      </q-linear-progress>
      <ul>
        <li>
          Maybe the best way is to not have a consolidated Projects menu item, but instead have
          separate lists, each with their own New Project button, all of which go to the same route
          with a different query param or something to determine the project type? Or try both?
          Maybe even separate models and tables for different project types, back to the modular
          idea.
        </li>
        <li>
          Redo the Project model based on recent notes. Create models for different project types
          that extend Project. Might be best to completely separate project tracking and logic by
          company.
        </li>
        <li>
          Redo the new project form, have the New Project button pull down a list of project types
          to pick from, which will get sent to the New Project form and populate the job number,
          determine which fields get displayed, and also determine who gets assigned to the project.
        </li>
        <li>
          For this to work, we'll need some logic that assigns an employee based on their role.
          Maybe a lab code field attached to Director roles. Supervisors can then delegate to
          technicians? Maybe too complicated at this point.
        </li>
      </ul>

      <div class="text-bold">Customers</div>
      <q-linear-progress size="25px" color="accent" :value="complete.customers / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.customers + '%'" />
        </div>
      </q-linear-progress>
      <ul>
        <li>
          Redo the Company Info and Interaction Log tabs with some better style, more like the
          Certifications tab
        </li>
        <li>Once Projects module is finished, hook up the Projects/Invoices tab</li>
        <li>
          Maybe separate Projects and Invoices? Or leave it as is since Projects and Invoices are
          interdependent? Maybe not always, e.g. listing fees
        </li>
      </ul>

      <div class="text-bold">Invoicing</div>
      <q-linear-progress size="25px" color="accent" :value="complete.invoicing / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.invoicing + '%'" />
        </div>
      </q-linear-progress>
      <ul>
        <li>
          Most of this data will come from other places, e.g. Projects, but I can still make the
          basics of list, search, etc.
        </li>
      </ul>

      <div class="text-bold">Organization / Personnel</div>
      <q-linear-progress size="25px" color="accent" :value="complete.organization / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.organization + '%'" />
        </div>
      </q-linear-progress>
      <ul>
        <li>Personnel: make decision on unassign vs delete roles</li>
        <li>
          Also try to put the personnel agreement in the system rather than have it as a document
          that needs to be uploaded
        </li>
        <li>
          If I can do that, then I might be able to include the CV in the Info tab like before, and
          remove the Documentation tab again. But where to handle the agreement?
        </li>
      </ul>

      <div class="text-bold">Quality System</div>
      <q-linear-progress size="25px" color="accent" :value="complete.qualitySystem / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.qualitySystem + '%'" />
        </div>
      </q-linear-progress>

      <div class="text-bold">Quality Control</div>
      <q-linear-progress size="25px" color="accent" :value="complete.qualityControl / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.qualityControl + '%'" />
        </div>
      </q-linear-progress>

      <div class="text-bold">Testing</div>
      <q-linear-progress size="25px" color="accent" :value="complete.testing / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.testing + '%'" />
        </div>
      </q-linear-progress>

      <div class="text-bold">Certification</div>
      <q-linear-progress size="25px" color="accent" :value="complete.certification / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.certification + '%'" />
        </div>
      </q-linear-progress>
      <ul>
        <li>Finish the Certification Detail page -- this is our first big milestone!</li>
        <li>
          Next step: create forms for adding/editing/deleting customer/listing/location info, only
          for admins! (In production, data will only be alterable through formal amendment process,
          but I need this to import all the existing data, and maybe to fix unintentional errors in
          the future)
        </li>
        <li>
          Need a section for QRC and a way to generate the prior year's project list along with PDF
          datasheets
        </li>
      </ul>

      <div class="text-bold">Inspection</div>
      <q-linear-progress size="25px" color="accent" :value="complete.inspection / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.inspection + '%'" />
        </div>
      </q-linear-progress>

      <div class="text-bold">Library</div>
      <q-linear-progress size="25px" color="accent" :value="complete.library / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.library + '%'" />
        </div>
      </q-linear-progress>
      <ul>
        <li>
          Integrate this whole module into the larger Projects schema, though best time to do this
          will probably be when I'm doing the other Project pages
        </li>
        <li>
          The "new" button should have two options: new standard or new revision. Each of these will
          have its own workflow.
        </li>
        <li>
          Adding new standard revisions should eventually be linked to a certification review
          process, if the standard is used for certifications
        </li>
        <li>
          And if it's a test method standard, it needs to be validated and technicians need to be
          passed off, so another process
        </li>
        <li>
          Also eventually, there should be a way to see all projects, certifications, etc associated
          with a given standard
        </li>
        <li>And we need a workflow and annual reminder for standards review</li>
      </ul>
    </div>

    <div>
      <p class="text-h6 q-pt-md">Content that Should Go Here:</p>
      <ul>
        <li>Open customer interaction follow-ups</li>
        <li>Open projects</li>
        <li>Completed projects that need invoicing</li>
        <li>Quick training entry</li>
        <li>
          Quality system stuff due: internal audit, management review, calibration expirations,
          inspections expiring, etc.
        </li>
        <li>For supervisors: pending actions for subordinates</li>
        <ul>
          <li>unverified probation targets</li>
          <li>performance review due</li>
          <li>unassigned projects</li>
        </ul>
        <li>For admins: shortcuts to admin actions and information</li>
        <ul>
          <li>data change log</li>
          <li>set up scheduled reminder notifications</li>
        </ul>
      </ul>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const complete = {
  overall: 10,
  auth: 70,
  projects: 30,
  customers: 80,
  invoicing: 0,
  organization: 75,
  qualitySystem: 0,
  qualityControl: 0,
  testing: 0,
  certification: 40,
  inspection: 0,
  library: 80,
};
</script>
