export { service, cn } from "ndzy-utils"

export const loop = (arr: any[]): any[] => {
  return [...arr]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const newItem = {
        ...item,
        key: item.id,
        label: item.title,
        value: item.id,
      }

      if (Array.isArray(item.children) && item.children.length > 0) {
        newItem.children = loop(item.children)
      } else {
        delete newItem.children
      }

      return newItem
    })
}

export const findNodeById: any = (tree: any[], id: string) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      return tree[i]
    } else if (tree[i].children) {
      // 如果有子节点，那么对子节点进行递归查找
      let result = findNodeById(tree[i].children, id)
      if (result) {
        return result
      }
    }
  }

  return null // 如果没找到，返回null
}

// 递归函数来搜索具有特定标题的节点，并返回路径
export const findPath: any = (data: any[], targetId: string, path = []) => {
  for (const item of data) {
    // 当前路径加上当前节点
    const newPath = [...path, item.title] // 或者使用item.id根据需要
    // 如果找到目标，返回路径
    if (item.id === targetId) {
      return newPath
    }
    // 如果该节点有子节点，递归搜索子节点
    if (item.children && item.children.length) {
      const result = findPath(item.children, targetId, newPath)
      if (result.length > 0) {
        return result // 如果在子树中找到目标，返回路径
      }
    }
  }
  // 如果没有找到目标
  return []
}
