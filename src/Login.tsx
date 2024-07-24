import { useContext } from "react"

import { Form, FormItem } from "./components/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button
} from "ndzy-utils"
import { service } from "./lib/utils"
import { ReduxContext } from "./store"

const Login = () => {
  const { state, dispatch } = useContext(ReduxContext)
  return (
    <div className="w-full h0full flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>登录之后即可解锁所有功能</CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={(v) => {
              service({ url: "/user/login", method: "POST", data: v }).then(
                (res) => {
                  if (res && res?.data?.token) {
                    localStorage.setItem("token", res?.data?.token)
                    dispatch({
                      type: "UPDATE",
                      payload: {
                        show: {
                          login: false,
                          article: true,
                          add: false,
                          edit: false,
                        },
                      },
                    })
                  }
                }
              )
            }}
          >
            <FormItem name="mobile">
              <Input
                type="text"
                className="my-4"
                required
                placeholder="请输入手机号"
              />
            </FormItem>

            <FormItem name="password">
              <Input
                className="my-4"
                type="password"
                required
                placeholder="请输入密码"
              />
            </FormItem>

            <Button className="w-full" type="submit" disabled={state.loading}>
              提交
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
