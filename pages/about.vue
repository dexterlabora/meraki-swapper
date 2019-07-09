<template>
  <v-layout column>
    <v-flex text-xs-center>
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;Merakified!&#8221;
        <footer>
          <small>
            <em>&mdash;Miles Meraki</em>
          </small>
        </footer>
      </blockquote>
    </v-flex>
    <v-flex>
      <v-card class="md-12 sm-12 lg-12">
        <v-card-text>
          <p>This tool provides the ability to swap out switches with a simple dynamic wizard.</p>
          <p>
            It also aims to demonstrate the power of using the
            <a
              href="https://meraki.io/api"
              target="_blank"
            >Meraki Dashboard API</a>
          </p>
          <p>
            For more information about how this progressive web app works, check out the
            <a
              href="https://github.com/dexterlabora/meraki-swapper"
              target="_blank"
            >source code</a> on GitHub.
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
