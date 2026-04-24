<template>
  <q-page padding>
    <div class="page-header">Dashboard</div>
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
    </ul>

    <div>
      <p class="text-h6 q-pt-md">App Completion Status:</p>
      <ul>
        <li>Authentication and Authorization: 0% complete</li>
        <ul>
          <li>
            Almost every component has something that needs to be hidden behind user authorizations
          </li>
          <li>So this should probably be done next</li>
        </ul>
        <li>Projects: 80% complete</li>
        <ul>
          <li>
            The bulk of what's incomplete cannot be finished until the datasheet templates are ready
            to accept data and generate reports
          </li>
          <li>The basic data collection and editing is done, though</li>
          <li>I'm not sure I like the project workflow, though -- rethink it a bit</li>
        </ul>
        <li>Customers: 90% complete</li>
        <ul>
          <li>Once Projects module is finished, hook up the Projects/Invoices tab</li>
          <li>Might be better to separate Projects and Invoices</li>
          <li>Or leave it as is since Projects and Invoices are interdependent?</li>
        </ul>
        <li>Invoicing: 0% complete</li>
        <li>Organization (including Personnel): 75% complete</li>
        <ul>
          <li>
            Legal Documents: need working upload functionality as soon as I have a backend and file
            storage
          </li>
          <li>Org Structure: Complete! (I think)</li>
          <li>
            Personnel: fix fields for CV and Personnel Agreement to view the file when one is
            uploaded, make decision on unassign vs delete roles
          </li>
        </ul>
        <li>Quality System: 0% complete</li>
        <li>Quality Control: 0% complete</li>
        <li>Testing: 0% complete</li>
        <li>Certification: 0% complete</li>
        <li>Inspection: 0% complete</li>
        <li>Library: 0% complete</li>
      </ul>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>
