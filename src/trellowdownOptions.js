import { TrelloOrganisation } from "./Trello/TrelloOrganisation"
import { TrelloMember } from "./Trello/TrelloMember";

export class TrellowdownOptions {
    static setup() {
        jQuery("#navigation-toggle").on("click", function(event) {
            TrellowdownOptions.setNavigation(jQuery(this).prop("checked"))
        })

        jQuery("#quick-add-toggle").on("click", function(event) {
            TrellowdownOptions.setQuickAdd(jQuery(this).prop("checked"))
        })

        TrellowdownOptions.setDefaults()
    }

    static setupSuperuserOptions() {
        TrelloOrganisation.getCurrentOrganisation()
            .then(id => TrelloOrganisation.getMembers(id))
            .then(members => {
                const membersHTML = TrelloMember.generateMembersHTML(members, "superuser-member")

                jQuery("#olly-boards").append(membersHTML)
                jQuery("#olly-boards input").on("change", event => {
                    this.setSuperuserMember(jQuery("input[name=superuser-member]:checked", "#olly-boards").val())
                })
            })
    }

    static setDefaults() {
        const navigationPreference = localStorage.getItem("td_navigation_toggle")
        const quickAddPreference = localStorage.getItem("td_quick_add_toggle")

        this.setOption(this.setNavigation, navigationPreference, false)
        this.setOption(this.setQuickAdd, quickAddPreference, true)
    }

    static getOption(option) {
        if(localStorage.getItem(option) !== null) {
            return { value: localStorage.getItem(option) }
        } else {
            return { error: "No Option Found" }
        }
    }

    static setOption(callback, value, defaultValue) {
        if(value === "true") {
            callback(true)
        } else if(value === "false") {
            callback(false)
        } else {
            callback(defaultValue)
        }
    }

    static setNavigation(value) {
        if(value === true) {
            jQuery(".trellowdown-menu").show()
            jQuery("#navigation-toggle").prop('checked', true)
            localStorage.setItem("td_navigation_toggle", true)
        } else {
            jQuery(".trellowdown-menu").hide()
            jQuery("#navigation-toggle").prop('checked', false)
            localStorage.setItem("td_navigation_toggle", false)
        }
    }

    static setQuickAdd(value) {
        if(value === true) {
            jQuery("#quick-add").show()
            jQuery("#quick-add-toggle").prop('checked', true)
            localStorage.setItem("td_quick_add_toggle", true)
        } else {
            jQuery("#quick-add").hide()
            jQuery("#quick-add-toggle").prop('checked', false)
            localStorage.setItem("td_quick_add_toggle", false)
        }
    }

    static setSuperuserMember(value) {
        localStorage.setItem("td_olly_override", value)
    }
}