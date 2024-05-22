import { useEffect, useReducer } from 'react';
import { initialState, reducer, ReduxContext } from './store';
import { create, del, query, save } from './service';
import { SnackbarProvider } from 'notistack';
import { Button } from './components/ui/button';
import Login from './Login';
import ArticleTree from './components/article-select';
import EditArticle from './components/edit-article';
import AddArticle from './components/add-article';
import { findNodeById } from './lib/utils';
import { EditorMd } from './components/editor-md';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    query(dispatch);
  }, []);

  return (
    <ReduxContext.Provider value={{ state, dispatch }}>
      <SnackbarProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col w-hull h-full">
            <header className="fixed top-0 z-[9999] w-full flex h-16 items-center gap-4 border-b bg-transparent px-4">
              <Button
                variant={!state.show.article ? 'outline' : 'default'}
                disabled={state.loading}
                onClick={() => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {
                      show: { article: !state.show.article, add: false, edit: false, login: false },
                      article: {},
                    },
                  });
                }}
              >
                文章
              </Button>

              <Button
                variant={!state.show.login ? 'outline' : 'default'}
                disabled={state.loading}
                onClick={() => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {
                      show: { login: !state.show.login, add: false, edit: false, article: false },
                      article: {},
                    },
                  });
                }}
              >
                登录
              </Button>
              <Button
                variant={!state.show.add ? 'outline' : 'default'}
                disabled={state.loading}
                onClick={() => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {
                      article: {},
                      show: { add: !state.show.add, edit: false, login: false, article: false },
                    },
                  });
                }}
              >
                新增
              </Button>
              <Button
                variant={!state.show.edit ? 'outline' : 'default'}
                disabled={!state.article?.id || state.loading}
                onClick={() => {
                  dispatch({
                    type: 'UPDATE',
                    payload: {
                      show: { edit: !state.show.edit, add: false, login: false, article: false },
                    },
                  });
                }}
              >
                编辑
              </Button>
              <Button
                variant="outline"
                disabled={!state.article?.id || state.loading}
                onClick={() => {
                  del(state.article.id, dispatch);
                }}
              >
                删除
              </Button>
            </header>
            <main className="mt-16 p-4">
              {state.loading && (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="m-4 h-4 w-4 animate-spin"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  加载中......
                </div>
              )}

              {state.show.login && <Login />}

              {state.show.add && <AddArticle create={create} data={state.articles} dispatch={dispatch} />}

              {state.show.edit && <EditArticle {...state.article} save={save} dispatch={dispatch} />}

              {state.show.article && (
                <>
                  <ArticleTree
                    placeholder="请选择文章"
                    data={state.articles}
                    onChange={(v) =>
                      dispatch({
                        type: 'UPDATE',
                        payload: {
                          article: findNodeById(state.articles, v[0]),
                          show: { ...state.show, edit: false, add: false },
                        },
                      })
                    }
                  />

                  {state.article?.content && <EditorMd type="view" value={state.article?.content} />}
                </>
              )}
            </main>
          </div>
        </div>
      </SnackbarProvider>
    </ReduxContext.Provider>
  );
}

export default App;
