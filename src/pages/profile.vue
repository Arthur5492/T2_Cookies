<template>
  <f7-page name="profile">
    <f7-navbar title="Profile"></f7-navbar>

    <f7-block-title>Update your personal data</f7-block-title>
    <f7-list strong-ios dividers-ios outline-ios>
      <f7-list-input label="Name" type="text" placeholder="Your name"></f7-list-input>
      <f7-list-input label="E-mail" type="email" placeholder="E-mail"></f7-list-input>
      <f7-list-input label="Password" type="password" placeholder="Password"></f7-list-input>
      <f7-list-input label="Phone" type="tel" placeholder="Phone"></f7-list-input>
      <f7-list-input label="Gender" type="select">
        <option>Male</option>
        <option>Female</option>
      </f7-list-input>

    </f7-list>
  </f7-page>
</template>
