import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { enqueueSnackbar } from 'notistack';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

class AxiosService {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(url: string): AxiosInstance {
    if (!AxiosService.instance) {
      AxiosService.instance = axios.create({
        baseURL: url, // 基础URL
        timeout: 60000, // 请求超时设置
        withCredentials: false, // 跨域请求是否需要携带 cookie
      });
    }
    return AxiosService.instance;
  }
}

export const createAxiosInstance = (url: string) => {
  const axiosInstance = AxiosService.getInstance(url);
  // 创建请求拦截
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers = { Authorization: `Basic ${token}` } as AxiosRequestHeaders;
      }

      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );
  // 创建响应拦截
  axiosInstance.interceptors.response.use(
    (res) => {
      const data = res.data;

      if (res.data.status === 1) {
        enqueueSnackbar(res.data.msg, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      }

      if (res.data.status === 0) {
        enqueueSnackbar(res.data.msg, { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
      }

      return data;
    },
    (error) => {
      if (error?.response?.data?.statusCode === 401) {
        enqueueSnackbar('登录失效，请重新登录', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        });
        return;
      }

      enqueueSnackbar('出错了，请联系管理员', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });

      return Promise.reject('出错了，请联系管理员');
    },
  );

  return axiosInstance;
};

export const service = createAxiosInstance('https://ndzy-s.vercel.app');

export const loop = (arr: any[]): any[] => {
  return [...arr]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const newItem = { ...item, key: item.id, label: item.title, value: item.id };

      if (Array.isArray(item.children) && item.children.length > 0) {
        newItem.children = loop(item.children);
      } else {
        delete newItem.children;
      }

      return newItem;
    });
};

export const findNodeById: any = (tree: any[], id: string) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      return tree[i];
    } else if (tree[i].children) {
      // 如果有子节点，那么对子节点进行递归查找
      let result = findNodeById(tree[i].children, id);
      if (result) {
        return result;
      }
    }
  }

  return null; // 如果没找到，返回null
};

// 递归函数来搜索具有特定标题的节点，并返回路径
export const findPath: any = (data: any[], targetId: string, path = []) => {
  for (const item of data) {
    // 当前路径加上当前节点
    const newPath = [...path, item.title]; // 或者使用item.id根据需要
    // 如果找到目标，返回路径
    if (item.id === targetId) {
      return newPath;
    }
    // 如果该节点有子节点，递归搜索子节点
    if (item.children && item.children.length) {
      const result = findPath(item.children, targetId, newPath);
      if (result) {
        return result; // 如果在子树中找到目标，返回路径
      }
    }
  }
  // 如果没有找到目标
  return [];
};
