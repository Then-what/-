
<!-- 登录页 -->
<template>
    <van-toast style="padding: 0">
        {{ showToast }}
    </van-toast>
    <div class="login">
        <div class="from-login">
            <h2>登录</h2>
            <!-- 表单 -->
            <van-form @submit="onSubmit">
                <van-cell-group inset >
                    <van-field
                    v-model="phone"
                    name="手机号码"
                    label="手机号码"
                    placeholder="手机号码"
                    :rules="[{ required: true, message: '请填写手机号码' }]"
                    />
                    <van-field
                    v-model="captcha"
                    type="captcha"
                    name="验证码"
                    label="验证码"
                    placeholder="验证码"
                    :rules="[{ required: true, message: '请填写验证码' }]"
                    >
                    <template #button>
                        <van-button @click="sendCaptcha" size="small" type="primary">发送验证码</van-button>
                    </template>
                    </van-field>
                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button round block type="primary" native-type="submit">
                    登录
                    </van-button>
                </div>
            </van-form>
            <p @click="getQrData" style="margin-bottom: 10px;">扫码登录</p>
            <p>没有账号？去<span @click="router.push('/register')">注册</span></p>
        </div>
    </div>

    <van-popup v-model:show="qrData.showQr" :style="{ padding: '10px' }">
        <span class="alertText" v-show="qrData.noQr">二维码失效</span>
        <img :src="qrData.qrBaseUrl" alt="">
        <p style="text-align: center; margin-bottom: 10px;">请使用网易云APP扫码登录</p>
        <p @click="getQrData" style="text-align: center;">重新获取二维码</p>
    </van-popup>
</template>

<script setup>
    import router from '@/router';
    import { onMounted, reactive, ref} from 'vue';
    import { showToast } from "vant";
    import axios from 'axios';
    import { neteaseCloudMusicApi } from '@/utils/apiUtils';

    const phone = ref('');
    const captcha = ref('');
    
    let timer = ref('');

    async function onSubmit(values){
        let stateCode = 0;
        if(phone.value === ''){
            showToast('请填写手机号码或验证码！');
            return
        }

        await neteaseCloudMusicApi('captcha/verify', [{name: 'phone', value: phone.value}, {name: 'captcha', value: captcha.value}]).then(
            res => {
                console.log(res.code)
                stateCode = res.code;
            }
        );

        if(stateCode == 200){
            clearInterval(timer.value);
            let isTrue = false;
            // await neteaseCloudMusicApi('', [{name: 'phone', value: phone.value}, {name: 'captcha', value: captcha.value}]).then(
            //     res => {
            //         console.log(res)
            //     }
            // );
            await axios.post('http://localhost:8080/data/login/cellphone', {phone: phone.value, captcha: captcha.value}).then(
                res => {
                    isTrue = true;
                    console.log(res)
                },
                err => {
                    console.log(err);
                    showToast('登录失败')
                }
            )
            if(isTrue){
                timer.value = setTimeout(() => {
                    showToast('登录成功');
                    router.push('/home');
                }, 2000);

            }
        }else{
            captcha.value = '';
            showToast('验证码错误');
            return;
        }
    };

    // 发送验证码
    function sendCaptcha(){
        if(phone.value === ''){
            showToast('请填写手机号码');
            return
        }
        neteaseCloudMusicApi('captcha/sent', [{name: 'phone', value: phone.value}]).then(
            res => {
                console.log(res.code)

            }
        );
    }

    // 二维码登录
    const qrData = reactive({
        showQr: false,
        qrBaseUrl: '',
        noQr: false,
        timer: '',
        qrKey: '',
        qrCookie: []
    })
    async function getQrData(){
        qrData.qrKey = '';
        await neteaseCloudMusicApi('login/qr/key').then(
            res => {
                console.log(res)
                qrData.qrKey = res.data.unikey;
            }
        )
        await neteaseCloudMusicApi('login/qr/create', [{name: 'key', value: qrData.qrKey}, {name: 'qrimg'}]).then(
            res => {
                qrData.qrBaseUrl = res.data.qrimg;
            }
        )
        qrData.showQr = true;
        
        clearInterval(qrData.timer);
        qrData.timer = setInterval(loopQrstatu, 5000);
        
    }
    async function loopQrstatu(){
        if(!qrData.showQr){
            clearInterval(qrData.timer);
        }
        let qrStatuCode = 0
        await neteaseCloudMusicApi('login/qr/check', [{name: 'key', value: qrData.qrKey}]).then(
            res => {
                console.log(res)
                qrStatuCode = res.code;
                if(res.code === 803){
                    qrData.qrCookie = res.cookie;
                }
            }
        )

        if(qrStatuCode === 800){
            qrData.noQr=true;
            clearInterval(qrData.timer);
        }
        if(qrStatuCode === 803){
            clearInterval(qrData.timer);
            showToast('登录成功')
            router.push('/home')

        }

    }

    onMounted(()=>{
        /* neteaseCloudMusicApi('login/status').then(
            res => {
                console.log(res)
                if(res.data.account){
                    router.push('/home')
                }
            }
        ) */
    })
</script>

<style lang="less" scoped>
    .alertText{
        color: red;
        position: absolute;
        font-size: 24px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .login{
        // 设置背景样式及表单居中
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--primary-color);
        .from-login{
            h2{
                text-align: center;
                margin: 20px 0;
            }
            // 登录表单样式
            padding: 10px;
            width: 80%;
            background-color: white;
            border-radius: 10px;
            p{
                text-align: center;
                span{
                    cursor: pointer;
                    color: var(--primary-color);
                }
            }
        }
    }
</style>