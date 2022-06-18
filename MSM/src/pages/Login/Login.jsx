import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import './Login.css'
import logo from '../../assets/MSM.png'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect} from "react-router-dom"
import React, { Component } from 'react'
import { LoginBackend, MSM_Login } from '../../api/index'

// const result = {
//     status: 0,
//     data: 'tan',
//     msg: 'salah pass lah!'
// }

export class Login extends Component {

    onFinish = async (values) => {

        const { username, password } = values

        const result = await MSM_Login(username, password)

        console.log(result);

        if (result.user.projectID === 'MSM') { //success

            console.log('success');

            // save user info to local
            const user = {
                name: username,
                site: 'All',
                role: 'Operator',
                autolevel: 2
            }
            memoryUtils.user = user
            storageUtils.saveUser(user)
            message.success('Login Success')
            this.props.history.replace('/')
        }

        else { //wrong pass or name
            console.log('result');
            message.error('Login Fail')
        }

    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        const user = memoryUtils.user
        if (Object.keys(user).length !== 0) {
            console.log('smtg')
            console.log(Object.keys(user).length)

            return <Redirect push to="/" />
            // return <Redirect to='/' />
        }
        else {
            console.log('ntg')
            console.log(Object.keys(user).length)
        }

        return (
            <div className='login'>

                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>MSM</h1>
                </header>

                <Card className="login-content">

                    <section >
                        <h2>Login</h2>

                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.onFinish}
                            onFinishFailed={this.onFinishFailed}
                            autoComplete="off"
                            className="login-form"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </Card>
            </div>
        )
    }
}

export default Login
