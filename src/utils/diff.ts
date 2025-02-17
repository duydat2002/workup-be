/* eslint-disable no-prototype-builtins */
import { isEqual } from 'lodash'

export const getDiff = (oldObj: any, newObj: any, excludes: string[] = ['updatedAt']) => {
  let diff: { key: string; oldValue: any; newValue: any }[] = []

  Object.keys(oldObj).forEach((key) => {
    if (!excludes.some((e) => e == key)) {
      if (!newObj.hasOwnProperty(key)) {
        diff.push({ key, oldValue: oldObj[key], newValue: newObj[key] })
      } else if (!isEqual(oldObj[key], newObj[key])) {
        diff.push({ key, oldValue: oldObj[key], newValue: newObj[key] })
      }
    }
  })

  return diff
}
