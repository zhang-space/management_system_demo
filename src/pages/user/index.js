// 改进后的User组件代码
import React, { useEffect, useState } from 'react'
import {
  Button, Form, Input, Table, Modal, Select, 
  DatePicker, InputNumber, Popconfirm, message
} from 'antd'
import './user.css'
import { getUser, addUser, editUser, deleteUser } from '../../api'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'

const User = () => {
  // 搜索条件状态
  const [listData, setListData] = useState({ name: "" })
  // 表格数据状态
  const [tableData, setTableData] = useState([])
  // 加载状态
  const [loading, setLoading] = useState(false)
  // 弹窗类型：0（新增）1（编辑）
  const [modalType, setModalType] = useState(0)
  // 弹窗显示状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // 表单实例
  const [searchForm] = useForm() 
  const [form] = useForm()
  
  // 搜索事件处理
  const handleSearch = (val) => {
    setListData({ name: val.keyword || "" })
  }
  
  // 获取表格数据
  const getTableData = () => {
    setLoading(true)
    getUser(listData).then(({ data }) => {
      setTableData(data.list)
    }).catch(err => {
      message.error('获取用户列表失败')
      console.error(err)
    }).finally(() => {
      setLoading(false)
    })
  }
  
  // 监听搜索条件变化，重新获取数据
  useEffect(() => {
    getTableData()
  }, [listData])
  
  // 处理新增/编辑按钮点击
  const handleClick = (type, rowData) => {
    setIsModalOpen(true)
    if (type === 'add') {
      setModalType(0)
      form.resetFields()
    } else {
      setModalType(1)
      // 深拷贝防止修改原始数据
      const cloneData = JSON.parse(JSON.stringify(rowData))
      // 转换日期格式
      cloneData.birth = dayjs(rowData.birth)
      form.setFieldsValue(cloneData)
    }
  }
  
  // 处理删除用户
  const handleDelete = ({ id }) => {
    setLoading(true)
    deleteUser({ id }).then(() => {
      message.success('删除成功')
      getTableData()
    }).catch(err => {
      message.error('删除失败')
      console.error(err)
    }).finally(() => {
      setLoading(false)
    })
  }
  
  // 处理弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }
  
  // 处理弹窗确认
  const handleOk = () => {
    form.validateFields().then((val) => {
      // 格式化日期
      val.birth = dayjs(val.birth).format('YYYY-MM-DD')
      setLoading(true)
      
      const apiCall = modalType ? editUser(val) : addUser(val)
      const successMsg = modalType ? '编辑成功' : '新增成功'
      
      apiCall.then(() => {
        message.success(successMsg)
        handleCancel()
        getTableData()
      }).catch(err => {
        message.error(modalType ? '编辑失败' : '新增失败')
        console.error(err)
      }).finally(() => {
        setLoading(false)
      })
    })
  }
  
  // 初始化加载数据
  useEffect(() => {
    getTableData()
  }, [])
  
  // 表格列定义
  const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { 
      title: '性别', 
      dataIndex: 'sex',
      render: (val) => val ? '女' : '男'
    },
    { title: '出生日期', dataIndex: 'birth' },
    { title: '地址', dataIndex: 'addr' },
    {
      title: '操作',
      render: (rowData) => (
        <div className="flex-box">
          <Button 
            style={{marginRight: '5px'}} 
            onClick={() => handleClick('edit', rowData)}
          >
            编辑
          </Button>
          <Popconfirm
            title="提示"
            description="此操作将删除该用户, 是否继续?"
            okText="确认"
            cancelText="取消"
            onConfirm={() => handleDelete(rowData)}
          >
            <Button type="primary" danger>删除</Button>
          </Popconfirm>
        </div>
      )
    }
  ]
  
  return (
    <div className="user">
      {/* 顶部工具栏 */}
      <div className="flex-box space-between">
        <Button type="primary" onClick={() => handleClick('add')}>+新增</Button>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="keyword">
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">搜索</Button>
          </Form.Item>
        </Form>
      </div>
      
      {/* 用户数据表格 */}
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        rowKey={"id"}
      />
      
      {/* 新增/编辑用户弹窗 */}
      <Modal
        open={isModalOpen}
        title={modalType ? '编辑用户' : '新增用户'}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
        confirmLoading={loading}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          {modalType === 1 &&
            <Form.Item name="id" hidden>
              <Input/>
            </Form.Item>
          }
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="年龄"
            name="age"
            rules={[
              { type: 'number', message: '年龄必须是数字' },
              { required: true, message: '请输入年龄' }
            ]}
          >
            <InputNumber placeholder="请输入年龄" />
          </Form.Item>
          <Form.Item
            label="性别"
            name="sex"
            rules={[{ required: true, message: '性别是必选项' }]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { value: 0, label: '男' },
                { value: 1, label: '女' }
              ]}
            />
          </Form.Item>
          <Form.Item
            label="出生日期"
            name="birth"
            rules={[{ required: true, message: '请选择出生日期' }]}
          >
            <DatePicker placeholder="请选择" format="YYYY/MM/DD" />
          </Form.Item>
          <Form.Item
            label="地址"
            name="addr"
            rules={[{ required: true, message: '请填写地址' }]}
          >
            <Input placeholder="请填写地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default User