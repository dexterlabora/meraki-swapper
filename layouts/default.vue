<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-tile class="pt-4">
          <org-state-selector></org-state-selector>
        </v-list-tile>
        <v-list-tile v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer"/>
      <v-toolbar-title>Meraki Switch Swapper</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt/>
      </v-container>
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>
        Cisco Meraki &copy; 2019 -
        <a href="https://create.meraki.io">Meraki.io</a>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
import OrgStateSelector from "~/components/OrgStateSelector";
export default {
  components: {
    OrgStateSelector
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "home",
          title: "Switch Swapper",
          to: "/"
        },
        {
          icon: "info",
          title: "About",
          to: "/about"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Meraki Switch Swapper"
    };
  }
};
</script>
