<template>
<div class="vertical-center">
    <div class="bg-image">
        <div class="inner-block" >      
            <div class="vue-tempalte">
                <form @submit.prevent="onSubmit">
                    <h3>Sign In</h3>

                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input type="email" name="email" v-model="email" class="form-control form-control-lg" />
                    </div>
                    <br />
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" name="password" v-model="password" class="form-control form-control-lg" />
                    </div>
                    <br>
                    <button aria-label="Clicca per accedere al tuo account manager" type="submit" class="btn btn-dark btn-lg btn-block">Sign In</button>

                    <p class="forgot-password text-right mt-2 mb-4">
                        <a aria-label="Clicca se hai dimenticato la tua password." href="/forgotPassword">Forgot password ?</a>
                    </p>

                </form>

                <p role="alert" v-if="error">{{error}}</p>
            </div>
        </div>
    </div>   

    <Footer /> 
</div>
</template>

<script>
    import axios from 'axios'
    import Footer from './Footer.vue';
    export default {
        name: 'Login',
        components: {Footer: Footer},
        data: () => ({
          email: '',
          password: '',
          error: null,
        }),

        beforeMount(){
            if (window.localStorage.getItem("authTokenManager")) this.$router.push({path: '/'});
        },
        methods: {
        async onSubmit() {

        const body = {
                email: this.email,
                password: this.password
            }

        try {

            const {data} = await axios.post('http://localhost:8000/api/auth/loginManager', body);
            window.localStorage.setItem("authTokenManager", data.data.authToken);
            window.localStorage.setItem("userInfoManager", JSON.stringify(data.data.userInfo));

            this.$router.push({path: '/'});

        } catch(error) {
            try {
                const {data} = await axios.post('http://localhost:8000/api/auth/registerManager', body);

                window.localStorage.setItem("authTokenManager", data.data.authToken);
                window.localStorage.setItem("userInfoManager", JSON.stringify(data.data.userInfo));

                this.$router.push({path: '/'});

            } catch (error) {
                this.error = error.response.data.error
                setTimeout(() => {
                    this.error = null;
                }, 5000)
            }
        }
        }
        }
    }
</script>