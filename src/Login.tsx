import { useContext } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { ReduxContext } from './store';
import { Form, FormItem } from './components/form';
import { service } from './lib/utils';

export default () => {
  const { state, dispatch } = useContext(ReduxContext);
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
              service({ url: '/user/login', method: 'POST', data: v }).then((res) => {
                if (res && res?.data?.token) {
                  localStorage.setItem('token', res?.data?.token);
                  dispatch({ type: 'UPDATE', payload: { show: { ...state.show, login: false } } });
                }
              });
            }}
          >
            <FormItem name="mobile">
              <Input type="text" className="my-4" required placeholder="请输入手机号" />
            </FormItem>

            <FormItem name="password">
              <Input className="my-4" type="password" required placeholder="请输入密码" />
            </FormItem>

            <Button className="w-full" type="submit" disabled={state.loading}>
              提交
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
