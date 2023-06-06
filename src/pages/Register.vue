
<template>
    <van-toast style="padding: 0">
        {{ showToast }}
    </van-toast>
    <div class="register">
        <div class="from-register">
            <h2>注册</h2>
            <!-- 表单 -->
            <van-form @submit="onSubmit">
                <van-cell-group inset >
                    <van-field class="label-justify"
                    v-model="username"
                    name="用户名"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, validator: validatorUsername, message: '请填写用户名' }]"
                    />
                    <van-field class="label-justify"
                    v-model="phone"
                    name="手机号码"
                    label="手机号码"
                    placeholder="手机号码"
                    :rules="[{ required: true, message: '请填写手机号码' }]"
                    />
                    <van-field class="label-justify"
                    v-model="password1"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, validator: validatorPassword, message: '请填写密码' }]"
                    />
                    <van-field class="label-justify"
                    v-model="password2"
                    type="password"
                    name="密码"
                    label="确认密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请再次确认密码' }]"
                    />
                    <van-field class="label-justify"
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
                    注册
                    </van-button>
                </div>
            </van-form>
            <p>返回<span @click="router.push('/login')">登录</span></p>
        </div>
    </div>
</template>

<script setup>
    import router from '@/router';
    import {ref} from 'vue';
    import { showToast } from "vant";
    import { neteaseCloudMusicApi } from '@/utils/apiUtils';
    const username = ref('');
    const phone = ref('');
    const password1 = ref('');
    const password2 = ref('');
    const captcha = ref('');
    let timer = ref('');

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

    
    
    // 校验用户名
    async function validatorUsername(username){
        // 使用正则判断一下用户名开头是否是特殊符号
        if(/^[^0-9!@#%^&*(){}[\]"'|?\\><,./:;]/.test(username)){
            if(username.length >= 4 && username.length <= 16){
                await neteaseCloudMusicApi('nickname/check', [{name: 'nickname', value: username.value}]).then(
                    res => {
                        if(res.duplicated){
                            return '该用户名已被使用！';
                        }
                    }
                );
                
            }else{
                return '用户名长度需要为4~16个字符'
            }
        }else{
            return '用户名不能以数值或特殊符号开头';
        }
    }
    // 校验密码
    function validatorPassword(password){
        if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password)){
            return '密码必须包含字母和数字，且在6~18位之间'
        }
    }
    
    // 提交绑定的函数
    async function onSubmit(values){
        if(!confirm('该注册是使用了网易云的API接口，注册可能会在网易云服务器上也会注册上去'))return
        // 比较两次输入密码是否一致
        if(password1.value != password2.value){
            password1.value = password2.value = '';
            showToast('两次输入的密码不一致');
            return
        }

        // 验证验证码是否一致
        let stateCode = 0;
        await neteaseCloudMusicApi('captcha/verify', [{name: 'phone', value: phone.value}, {name: 'captcha', value: captcha.value}]).then(
            res => {
                console.log(res.code)
                stateCode = res.code;
            }
        );
        
        console.log(typeof stateCode)
        // 检测手机号是否已被使用
        let exist = 0;
        await neteaseCloudMusicApi('cellphone/existence/check', [{name: 'phone', value: phone.value}]).then(
            res => {
                console.log(res.exist)
                let exist = res.exist;
            }
        );
        if(exist < 0){
            showToast('该手机号码已被注册！');
            return;
        }
        if(stateCode === 200){
            const params = [
                {name: 'phone', value: phone.value}, 
                {name: 'captcha', value: captcha.value}, 
                {name: 'nickname', value: username.value}, 
                {name: 'password', value: password1.value}]
            neteaseCloudMusicApi('register/cellphone', params).then(
                res => {
                    console.log(res.code)
                    stateCode = res.code;
                }
            );

        }else{
            showToast('验证码错误');
            return;
        }

        

        clearInterval(timer.value);
        timer.value = setTimeout(() => {
            router.push('/login')
        }, 2000);
    };
</script>

<style lang="less" scoped>
    .label-justify .vant-field__label{
        text-align-last: justify;
        &::after{
            content: ":";
        }
    }
    .register{
        // 设置背景样式及表单居中
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--primary-color);
        .from-register{
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