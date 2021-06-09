Vue.component('modal', {
    props: ['modal_type'],
    data: function() {
        return {'display_values': {
            'login': {
               'header': 'Log In',
               'footer_button1': 'Log In',
               'footer_button2': 'Sign Up'
            },
            'register': {
                'header': 'Sign Up',
                'footer_button1': 'Sign Up',
                'footer_button2': 'Log In'
             },
            'reset_password': {
                'header': 'Reset Password',
                'footer_button1': 'Reset',
                'footer_button2': 'Cancel'
             },
            'update_password': {
                'header': 'Update Password',
                'footer_button1': 'Update',
                'footer_button2': 'Cancel'
             },
            'submit_info': {
                'header': 'Provide Information',
                'footer_button1': 'Submit',
                'footer_button2': 'Cancel'
             },
            'delete_account': {
                'header': 'Delete Account',
                'footer_button1': 'Delete',
                'footer_button2': 'Cancel'
             }
            },
            'type': this.modal_type
        }
    },
    template: `
<transition name="modal">
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    {{ display_values[type].header }}
                </div>

                <div class="modal-body">
                    <div v-if='type === "login"'>
                        <form id="login_form">
                            Username:<br>
                            <input type="text" name="username"><br>
                            Password:<br>
                            <input type="text" name="password"><br>
                        </form>
                    </div>

                    <div v-if='type === "register"'>
                        <form id="register_form">
                            Username:<br>
                            <input type="text" name="username"><br>
                            Password:<br>
                            <input type="text" name="password1"><br>
                            Repeat Password:<br>
                            <input type="text" name="password2"><br>
                        </form>
                    </div>

                    <div v-if='type === "reset_password"'>
                        <form id="reset_password_form">

                        </form>
                    </div>

                    <div v-if='type === "update_password"'>
                        <form id="update_password_form">
                            Old Password:<br>
                            <input type="text" name="password0"><br>
                            New Password:<br>
                            <input type="text" name="password1"><br>
                            Repeat New Password:<br>
                            <input type="text" name="password2"><br>
                        </form>
                    </div>

                    <div v-if='type === "submit_info"'>
                        <form id="submit_info_form">
                            Age:<br>
                            <input type="text" name="age"><br>
                            Weight:<br>
                            <input type="text" name="weight"><br>
                            Height:<br>
                            <input type="text" name="height"><br>
                            Gender:<br>
                            <div>
                                <input type="radio" id="male" name="gender" value="M">
                                <label for="male">Male</label><br>
                                <input type="radio" id="female" name="gender" value="G">
                                <label for="female">Female</label><br>
                            </div>
                            Goal:<br>
                            <div>
                                <input type="radio" id="lose" name="goal" value="L">
                                <label for="lose">Lose Weight</label><br>
                                <input type="radio" id="maintain" name="goal" value="M">
                                <label for="maintain">Maintain</label><br>
                                <input type="radio" id="gain" name="goal" value="G">
                                <label for="gain">Build Muscle</label>
                            </div>
                            Bodyfat:<br>
                            <div>
                                <input type="radio" id="low" name="bodyfat" value="10">
                                <label for="low">Low (under 14%)</label><br>
                                <input type="radio" id="medium" name="bodyfat" value="20">
                                <label for="medium">Medium (14% to 22%)</label><br>
                                <input type="radio" id="high" name="bodyfat" value="30">
                                <label for="high">High (above 22%)</label>
                            </div>
                            Activity Level:<br>
                            <div>
                                <input type="radio" id="sedentary" name="activity_level" value="1.2">
                                <label for="sedentary">Sedentary</label><br>
                                <input type="radio" id="light" name="activity_level" value="1.375">
                                <label for="light">Lightly Active</label><br>
                                <input type="radio" id="moderate" name="activity_level" value="1.55">
                                <label for="moderate">Moderately Active</label>
                                <input type="radio" id="very" name="activity_level" value="1.725">
                                <label for="very">Very Active</label>
                                <input type="radio" id="extreme" name="activity_level" value="1.9">
                                <label for="extreme">Extremely Active</label>
                            </div>

                            <!--
                            Diet:<br>
                            <div>
                                <input type="radio" id="anything" name="preset_diet" value="anything">
                                <label for="anything">Anything</label><br>
                                <input type="radio" id="paleo" name="preset_diet" value="paleo">
                                <label for="paleo">Paleo</label><br>
                                <input type="radio" id="vegetarian" name="preset_diet" value="vegetarian">
                                <label for="vegetarian">Vegetarian</label>
                                <input type="radio" id="vegan" name="preset_diet" value="vegan">
                                <label for="vegan">Vegan</label>
                                <input type="radio" id="ketogenic" name="preset_diet" value="atkins / ketogenic">
                                <label for="ketogenic">Ketogenic</label>
                                <input type="radio" id="mediterranean" name="preset_diet" value="mediterranean">
                                <label for="mediterranean">Mediterranean</label>
                            </div>
                            -->
                        </form>
                    </div>

                    <div v-if='type === "delete_account"'>
                        <form id="delete_account_form">
                            Password:<br>
                            <input type="text" name="password"><br>
                        </form>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="modal-default-button" v-on:click="buttonAction(0)">
                        {{ display_values[type].footer_button1 }}
                    </button>
                    <button class="modal-default-button" v-on:click="buttonAction(1)">
                        {{ display_values[type].footer_button2 }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</transition>`,
    created: function () {
        
    },
    methods: {
        buttonAction: function(index) {
            switch (this.type) {
                case "login":
                    form_data = document.getElementById('login_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"username": form_data.username.value, "password": form_data.password.value});
                    } else {
                        this.type = "register";
                    }
                break;
                case "register":
                    form_data = document.getElementById('register_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"username": form_data.username.value,
                         "password1": form_data.password1.value, "password2": form_data.password2.value});
                    } else {
                        this.type = "login";
                    }
                break;
                case "reset_password":
                    form_data = document.getElementById('reset_password_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"email": 0});
                    } else {
                        this.$emit('close');
                    }
                break;
                case "update_password":
                    form_data = document.getElementById('update_password_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"password0": form_data.password0.value,
                         "password1": form_data.password1.value, "password2": form_data.password2.value});
                    } else {
                        this.$emit('close');
                    }
                break;
                case "submit_info":
                    form_data = document.getElementById('submit_info_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {
                            "age": form_data.age.value, "weight": form_data.weight.value, "height": form_data.height.value,
                            "gender": form_data.gender.value, "goal": form_data.goal.value, "bodyfat": form_data.bodyfat.value,
                            "activity_level": form_data.activity_level.value, "preset_diet": "anything", "weight_goal": null,
                            "weight_goal_weekly_value": null
                        });
                    } else {
                        this.$emit('close');
                    }
                break;
                case "delete_account":
                    form_data = document.getElementById('delete_account_form')
                    if (index == 0) {
                        this.$emit('button_action', this.type, {"password": form_data.password.value});
                    } else {
                        this.$emit('close');
                    }
                break;
            }
        }
    }

})
