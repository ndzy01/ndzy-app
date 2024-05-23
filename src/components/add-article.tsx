import { EditorMd } from './editor-md';
import { enqueueSnackbar } from 'notistack';
import { useContext } from 'react';
import { ReduxContext } from '../store';
import ArticleSelect from './article-select';
import { Form, FormItem } from './form';
import { Input } from './ui/input';
import { Button } from './ui/button';

const AddArticle = ({ create, data, dispatch }: any) => {
  const { state } = useContext(ReduxContext);
  const ArticleSelectFormItem = (props: any) => {
    return <ArticleSelect {...props} value={props.value} onChange={(v) => props.onChange(v)} />;
  };

  return (
    <div className="relative w-full flex min-h-full p-8">
      <div className="w-full h-[90vh]">
        <div className="space-y-6">
          <Form
            initialValues={{ title: '', content: '', order: '' }}
            onSubmit={(v) => {
              if (!v.content) {
                enqueueSnackbar('内容不能为空', {
                  variant: 'error',
                  anchorOrigin: { vertical: 'top', horizontal: 'center' },
                });

                return;
              }

              create(
                {
                  ...v,
                  parentId: v.parentId && v.parentId.length > 0 ? v.parentId[0] : undefined,
                  order: Number(v.order),
                },
                dispatch,
              );

              dispatch({
                type: 'UPDATE',
                payload: { show: { login: false, article: true, add: false, edit: false } },
              });
            }}
          >
            <FormItem name="parentId" type="custom">
              <ArticleSelectFormItem data={data} placeholder="请选择父级目录" />
            </FormItem>

            <FormItem name="title">
              <Input required type="text" className="my-4" placeholder="请输入标题" />
            </FormItem>

            <FormItem name="content" type="custom">
              <EditorMd className="my-4" />
            </FormItem>

            <FormItem name="order">
              <Input required type="text" className="my-4" placeholder="请输入顺序" />
            </FormItem>

            <Button className="w-full" type="submit" disabled={state.loading}>
              提交
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddArticle;
