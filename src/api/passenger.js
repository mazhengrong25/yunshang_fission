/*
 * @Description: 乘机人数据
 * @Author: wish.WuJunLong
 * @Date: 2020-08-11 11:10:20
 * @LastEditTime: 2020-08-17 09:47:47
 * @LastEditors: wish.WuJunLong
 */
import request from '@/api/request';

/**
 * @Description: 获取乘机人列表
 * @author Wish
 * @date 2020/8/14
*/
function getPassenger (data) {
  return request({
    method: "POST",
    url: '/api/passenger/index',
    data: data
  })
}

// 删除乘机人
function removePassenger (id){
  return request({
    method: 'POST',
    url: '/api/passenger/del/'+ id
  })
}


// 获取分组列表
function getGroup(){
  return request({
    method: 'POST',
    url: '/api/passenger/groupIndex'
  })
}

// 添加分组
function addGroup(data){
  return request({
    method: 'POST',
    url: '/api/passenger/groupAdd',
    data: data
  })
}


// 添加乘机人
function addPassenger(data){
  return request({
    method :'POST',
    url: '/api/passenger/add',
    data:data
  })
}

// 编辑乘机人
function editPassenger(data,id){
  return request({
    method :'POST',
    url: '/api/passenger/edit/'+id,
    data:data
  })
}

export default{
  getPassenger,
  removePassenger,
  getGroup,
  addGroup,
  addPassenger,
  editPassenger
}