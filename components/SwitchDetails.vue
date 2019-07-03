<template>
  <div>
    <!--
    <ul>
      <li v-for="(item, key) in items" :key="item">
        <v-label>{{key}}</v-label>
        {{ item }}
      </li>
    </ul>
    -->
    <v-card>
      <v-card-text>
        <v-list-tile v-for="(item, key) in items" :key="key" avatar @click>
          <!--s
      <v-list-tile-avatar>
        <v-icon small>keyboard_arrow_right</v-icon>
      </v-list-tile-avatar>
          -->

          <v-list-tile-content>
            <v-list-tile-title>
              <strong>{{ key }}</strong>
            </v-list-tile-title>
            <v-list-tile-sub-title>{{ item }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <!--
          <v-list-tile-action>
            <v-btn icon ripple>
              <v-icon color="grey lighten-1">info</v-icon>
            </v-btn>
          </v-list-tile-action>
          -->
        </v-list-tile>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["switchDetails"],
  computed: {
    items() {
      return (
        this.switchDetails || {
          serial: undefined
        }
      );
    }
  },
  data: () => ({}),
  methods: {}
};
</script>

<style>
</style>
