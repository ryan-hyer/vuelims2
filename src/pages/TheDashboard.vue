<template>
  <q-page padding>
    <div class="page-header">Dashboard</div>

    <div>
      <p class="text-h6 q-pt-md">App Completion Status:</p>

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
          Can't do much more until the datasheet templates are ready to accept data and generate
          reports
        </li>
        <li>
          I'm not sure I like the project workflow overall -- rethink it a bit.
          <span class="text-bold">Do this next after Standards</span> since this is one of the most
          important parts of this app
        </li>
      </ul>

      <div class="text-bold">Customers</div>
      <q-linear-progress size="25px" color="accent" :value="complete.customers / 100">
        <div class="absolute-full flex flex-center">
          <q-badge color="white" text-color="accent" :label="complete.customers + '%'" />
        </div>
      </q-linear-progress>
      <ul>
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
        <li>
          Maybe we can integrate library check-out and check-in records somehow too? A separate menu
          item if so. <span class="text-bold">Do this next</span> so we can close out the Standards
          git branch
        </li>
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
  auth: 70,
  projects: 30,
  customers: 80,
  invoicing: 0,
  organization: 75,
  qualitySystem: 0,
  qualityControl: 0,
  testing: 0,
  certification: 0,
  inspection: 0,
  library: 80,
};
</script>
