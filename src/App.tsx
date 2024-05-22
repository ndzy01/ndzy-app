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
                variant={!state.show.add ? 'outline' : 'default'}
                disabled={state.loading}
                onClick={() => {
                  dispatch({ type: 'UPDATE', payload: { show: { ...state.show, login: !state.show.login } } });
                }}
              >
                登录
              </Button>
              <Button
                variant={!state.show.add ? 'outline' : 'default'}
                disabled={state.loading}
                onClick={() => {
                  dispatch({ type: 'UPDATE', payload: { show: { ...state.show, add: !state.show.add, edit: false } } });
                }}
              >
                新增
              </Button>
              <Button
                variant={!state.show.add ? 'outline' : 'default'}
                disabled={!state.article?.id || state.loading}
                onClick={() => {
                  dispatch({
                    type: 'UPDATE',
                    payload: { show: { ...state.show, edit: !state.show.edit, add: false } },
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
              {state.show.login && <Login />}

              {state.show.add && <AddArticle create={create} data={state.articles} dispatch={dispatch} />}

              {state.show.edit && <EditArticle {...state.article} save={save} dispatch={dispatch} />}

              {!state.show.login && !state.show.add && !state.show.edit && (
                <>
                  <ArticleTree
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
                  <EditorMd type="view" value={state.article?.content} />
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
