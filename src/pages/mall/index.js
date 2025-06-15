import React, { useState, useEffect } from 'react'
import { 
  Input, Card, Row, Col, Pagination, Tag, Rate, 
  Slider, Select, Button, Divider, Badge, Spin,
  Statistic, Typography, Space, Table, Dropdown,
  Menu, Modal, Form, InputNumber, Upload, Switch,
  Tabs, DatePicker, message
} from 'antd'
import { 
  SearchOutlined, AppstoreOutlined, BarsOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined,
  EyeOutlined, UploadOutlined, ExportOutlined, 
  FilterOutlined, ReloadOutlined, SettingOutlined,
  DownOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import './mall.css'

const { Search } = Input
const { Option } = Select
const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const AdminMall = () => {
  // 默认图片（Base64格式）
  const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjEwMCIgeT0iMTAwIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEzcHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+5Zu+54mH5peg5rOV5pi+56S6PC90ZXh0Pjwvc3ZnPg==';

  const [loading, setLoading] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [products, setProducts] = useState([])
  const [viewMode, setViewMode] = useState('list') // 管理后台默认为列表视图
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10) // 管理后台默认每页10条
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMethod, setSortMethod] = useState('default')
  
  // 弹窗状态
  const [productModalVisible, setProductModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [currentProduct, setCurrentProduct] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  
  // 图片上传状态
  const [uploadedImage, setUploadedImage] = useState(null)
  
  // 表单实例
  const [form] = Form.useForm()

  // 模拟商品数据
  const mockProducts = [
    { 
      id: 1, 
      name: '高级智能手机', 
      price: 5999, 
      originalPrice: 6999,
      rating: 4.8, 
      sales: 2543,
      image: 'https://via.placeholder.com/300x300?text=Smartphone',
      category: 'electronics',
      tags: ['热销', '新品'],
      discount: '85折',
      stock: 128,
      status: 'active',
      createTime: '2025-05-20 14:30:22'
    },
    { 
      id: 2, 
      name: '专业游戏笔记本电脑', 
      price: 8999, 
      originalPrice: 9999,
      rating: 4.7, 
      sales: 1250,
      image: 'https://via.placeholder.com/300x300?text=Gaming+Laptop',
      category: 'electronics',
      tags: ['限时特惠'],
      discount: '9折',
      stock: 45,
      status: 'active',
      createTime: '2025-05-22 09:15:36'
    },
    { 
      id: 3, 
      name: '真无线蓝牙耳机', 
      price: 899, 
      originalPrice: 1299,
      rating: 4.5, 
      sales: 5621,
      image: 'https://via.placeholder.com/300x300?text=Earbuds',
      category: 'electronics',
      tags: ['爆款'],
      discount: '7折',
      stock: 230,
      status: 'active',
      createTime: '2025-05-15 16:48:10'
    },
    { 
      id: 4, 
      name: '时尚运动鞋', 
      price: 499, 
      originalPrice: 699,
      rating: 4.3, 
      sales: 3250,
      image: 'https://via.placeholder.com/300x300?text=Sneakers',
      category: 'clothing',
      tags: ['舒适'],
      discount: '7折',
      stock: 89,
      status: 'active',
      createTime: '2025-05-18 11:22:45'
    },
    { 
      id: 5, 
      name: '智能手表', 
      price: 1299, 
      originalPrice: 1699,
      rating: 4.6, 
      sales: 1876,
      image: 'https://via.placeholder.com/300x300?text=Smartwatch',
      category: 'electronics',
      tags: ['防水'],
      discount: '76折',
      stock: 67,
      status: 'inactive',
      createTime: '2025-05-10 08:33:17'
    },
    { 
      id: 6, 
      name: '防晒霜SPF50', 
      price: 129, 
      originalPrice: 159,
      rating: 4.9, 
      sales: 9250,
      image: 'https://via.placeholder.com/300x300?text=Sunscreen',
      category: 'beauty',
      tags: ['必备'],
      discount: '8折',
      stock: 321,
      status: 'active',
      createTime: '2025-05-25 14:20:55'
    },
    { 
      id: 7, 
      name: '精致小挎包', 
      price: 299, 
      originalPrice: 459,
      rating: 4.2, 
      sales: 2130,
      image: 'https://via.placeholder.com/300x300?text=Handbag',
      category: 'accessories',
      tags: ['时尚'],
      discount: '65折',
      stock: 56,
      status: 'active',
      createTime: '2025-05-19 17:55:32'
    },
    { 
      id: 8, 
      name: '大容量双肩包', 
      price: 199, 
      originalPrice: 299,
      rating: 4.4, 
      sales: 3421,
      image: 'https://via.placeholder.com/300x300?text=Backpack',
      category: 'accessories',
      tags: ['耐用'],
      discount: '67折',
      stock: 0,
      status: 'inactive',
      createTime: '2025-05-12 10:42:18'
    }
  ]

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: 'electronics', label: '电子产品' },
    { value: 'clothing', label: '服装鞋帽' },
    { value: 'beauty', label: '美妆个护' },
    { value: 'accessories', label: '配件箱包' }
  ]

  const sortOptions = [
    { value: 'default', label: '默认排序' },
    { value: 'price-asc', label: '价格从低到高' },
    { value: 'price-desc', label: '价格从高到低' },
    { value: 'sales', label: '销量优先' },
    { value: 'stock-asc', label: '库存从低到高' },
    { value: 'stock-desc', label: '库存从高到低' },
    { value: 'create-time', label: '创建时间' }
  ]

  const statusFilters = [
    { value: 'all', label: '全部状态' },
    { value: 'active', label: '上架中' },
    { value: 'inactive', label: '已下架' }
  ]

  // 加载商品数据
  useEffect(() => {
    setLoading(true)
    // 模拟API调用
    setTimeout(() => {
      // 处理每个商品的图片，添加默认图片错误处理
      const processedProducts = mockProducts.map(product => ({
        ...product,
        // 添加默认图片处理
        processedImage: product.image
      }));
      
      setAllProducts(processedProducts)
      setProducts(processedProducts)
      setTotal(processedProducts.length)
      setLoading(false)
    }, 800)
  }, [])

  // 过滤和排序产品
  useEffect(() => {
    setLoading(true)
    
    let filteredProducts = [...allProducts]
    
    // 分类筛选
    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.category === selectedCategory
      )
    }
    
    // 价格范围筛选
    filteredProducts = filteredProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    
    // 搜索筛选
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.id.toString() === searchTerm
      )
    }
    
    // 排序
    switch (sortMethod) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'sales':
        filteredProducts.sort((a, b) => b.sales - a.sales)
        break
      case 'stock-asc':
        filteredProducts.sort((a, b) => a.stock - b.stock)
        break
      case 'stock-desc':
        filteredProducts.sort((a, b) => b.stock - a.stock)
        break
      case 'create-time':
        filteredProducts.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
        break
      default:
        // 默认排序，按ID
        filteredProducts.sort((a, b) => a.id - b.id)
        break
    }
    
    setProducts(filteredProducts)
    setTotal(filteredProducts.length)
    
    // 重置分页
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
    
    setTimeout(() => {
      setLoading(false)
    }, 400)
    
  }, [selectedCategory, priceRange, searchTerm, sortMethod, allProducts])

  // 处理搜索
  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  // 处理分类筛选
  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
  }

  // 处理排序
  const handleSortChange = (value) => {
    setSortMethod(value)
  }

  // 处理价格范围筛选
  const handlePriceChange = (value) => {
    setPriceRange(value)
  }

  // 处理分页
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    window.scrollTo(0, 0)
  }

  // 打开添加商品弹窗
  const handleAddProduct = () => {
    setModalMode('add')
    setCurrentProduct(null)
    setUploadedImage(null) // 重置上传的图片
    form.resetFields()
    
    // 设置新商品的默认值，特别是状态为上架(true)
    form.setFieldsValue({
      status: true,  // 设置默认为上架状态
      stock: 0,
      price: 0,
      originalPrice: 0
    })
    
    setProductModalVisible(true)
  }

  // 打开编辑商品弹窗
  const handleEditProduct = (product) => {
    setModalMode('edit')
    setCurrentProduct(product)
    setUploadedImage(null) // 重置上传的图片
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      tags: product.tags.join(','),
      discount: product.discount,
      status: product.status === 'active'
    })
    setProductModalVisible(true)
  }

  // 确认商品表单提交
  const handleProductFormSubmit = () => {
    form.validateFields().then(values => {
      // 打印当前表单值，以便调试
      console.log('表单提交值:', values);
      
      const formData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        status: values.status ? 'active' : 'inactive'
      }
      
      console.log('处理后的表单数据:', formData);
      
      if (modalMode === 'add') {
        // 添加商品逻辑
        const newProduct = {
          id: allProducts.length + 1,
          ...formData,
          sales: 0,
          rating: 5.0,
          image: uploadedImage || DEFAULT_IMAGE, // 使用上传的图片或默认图片
          createTime: new Date().toLocaleString()
        }
        
        console.log('新添加的商品:', newProduct);
        
        setAllProducts([...allProducts, newProduct])
        message.success('商品添加成功')
      } else {
        // 编辑商品逻辑
        const updatedProducts = allProducts.map(item => 
          item.id === currentProduct.id 
            ? { 
                ...item, 
                ...formData,
                // 如果上传了新图片，则使用新图片
                image: uploadedImage || item.image 
              } 
            : item
        )
        
        setAllProducts(updatedProducts)
        message.success('商品更新成功')
      }
      
      // 重置上传的图片
      setUploadedImage(null);
      setProductModalVisible(false)
    })
  }

  // 打开删除确认弹窗
  const handleDeleteConfirm = (product) => {
    setCurrentProduct(product)
    setDeleteModalVisible(true)
  }

  // 确认删除商品
  const handleDeleteProduct = () => {
    const updatedProducts = allProducts.filter(item => item.id !== currentProduct.id)
    setAllProducts(updatedProducts)
    setDeleteModalVisible(false)
    message.success('商品已删除')
  }

  // 更新商品状态
  const handleToggleStatus = (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    const updatedProducts = allProducts.map(item => 
      item.id === product.id 
        ? { ...item, status: newStatus } 
        : item
    )
    
    setAllProducts(updatedProducts)
    message.success(`商品已${newStatus === 'active' ? '上架' : '下架'}`)
  }

  // 处理图片上传
  const handleImageUpload = (info) => {
    if (info.file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(info.file);
    }
  };

  // 批量操作菜单
  const batchActionMenu = (
    <Menu>
      <Menu.Item key="1" icon={<CheckCircleOutlined />}>批量上架</Menu.Item>
      <Menu.Item key="2" icon={<CloseCircleOutlined />}>批量下架</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<DeleteOutlined />}>批量删除</Menu.Item>
      <Menu.Item key="4" icon={<ExportOutlined />}>导出数据</Menu.Item>
    </Menu>
  )

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image) => (
        <img 
          src={image} 
          alt="商品图片" 
          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
          onError={(e) => {e.target.src = DEFAULT_IMAGE}}
        />
      )
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div>
            {record.tags.map((tag, index) => (
              <Tag color="orange" key={index} style={{ marginRight: '4px' }}>{tag}</Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category) => {
        const cat = categories.find(c => c.value === category)
        return cat ? cat.label : category
      }
    },
    {
      title: '价格',
      key: 'price',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ color: '#f5222d' }}>¥{record.price}</div>
          <div style={{ color: '#8c8c8c', textDecoration: 'line-through', fontSize: '12px' }}>
            ¥{record.originalPrice}
          </div>
        </div>
      )
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      key: 'discount',
      width: 80
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      render: (stock) => (
        <span style={{ color: stock <= 50 ? '#ff4d4f' : stock <= 100 ? '#faad14' : '#52c41a' }}>
          {stock}
        </span>
      )
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
      width: 80
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: '12px' }} />
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '上架中' : '已下架'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditProduct(record)}
          />
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => console.log('查看商品详情', record)}
          />
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteConfirm(record)}
          />
          <Button
            type="text"
            icon={record.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
          />
        </Space>
      )
    }
  ]

  // 计算分页后的产品列表
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return products.slice(startIndex, endIndex)
  }

  // 商品统计数据
  const statistics = {
    total: allProducts.length,
    active: allProducts.filter(p => p.status === 'active').length,
    inactive: allProducts.filter(p => p.status === 'inactive').length,
    lowStock: allProducts.filter(p => p.stock <= 50).length
  }

  return (
    <div className="mall-container">
      {/* 数据统计区域 */}
      <Row gutter={16} className="stats-area">
        <Col span={6}>
          <Card className="stat-card">
            <Statistic 
              title="商品总数" 
              value={statistics.total} 
              prefix={<AppstoreOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic 
              title="在售商品" 
              value={statistics.active} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic 
              title="下架商品" 
              value={statistics.inactive} 
              valueStyle={{ color: '#8c8c8c' }}
              prefix={<CloseCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic 
              title="库存紧张" 
              value={statistics.lowStock} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ExclamationCircleOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      {/* 顶部工具栏 */}
      <div className="admin-toolbar">
        <div className="toolbar-left">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
          >
            添加商品
          </Button>
          <Dropdown overlay={batchActionMenu}>
            <Button style={{ marginLeft: 8 }}>
              批量操作 <DownOutlined />
            </Button>
          </Dropdown>
          <Button 
            icon={<ExportOutlined />}
            style={{ marginLeft: 8 }}
          >
            导出数据
          </Button>
        </div>
        
        <div className="toolbar-right">
          <Button 
            icon={<ReloadOutlined />}
            onClick={() => {
              setLoading(true)
              setTimeout(() => setLoading(false), 500)
            }}
          >
            刷新
          </Button>
          <Select 
            defaultValue="all"
            style={{ width: 120, marginLeft: 8 }}
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            {categories.map(cat => (
              <Option key={cat.value} value={cat.value}>{cat.label}</Option>
            ))}
          </Select>
          <Select
            defaultValue="all"
            style={{ width: 120, marginLeft: 8 }}
          >
            {statusFilters.map(status => (
              <Option key={status.value} value={status.value}>{status.label}</Option>
            ))}
          </Select>
        </div>
      </div>

      {/* 商品搜索 */}
      <div className="mall-header">
        <div className="mall-search">
          <Search
            placeholder="搜索商品名称或ID"
            allowClear
            enterButton={<><SearchOutlined /> 搜索</>}
            size="middle"
            onSearch={handleSearch}
          />
        </div>
      </div>
      
      <div className="mall-filters">
        <div className="filter-item price-filter">
          <span className="filter-label">价格区间: </span>
          <Slider
            range
            value={priceRange}
            min={0}
            max={10000}
            onChange={handlePriceChange}
            style={{ width: 200, margin: '0 16px' }}
          />
          <span>{priceRange[0]} - {priceRange[1]}元</span>
        </div>
        
        <div className="filter-item">
          <span className="filter-label">排序方式: </span>
          <Select
            value={sortMethod}
            style={{ width: 150 }}
            onChange={handleSortChange}
          >
            {sortOptions.map(option => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        </div>
        
        <div className="view-toggle">
          <Button
            type={viewMode === 'grid' ? 'primary' : 'default'}
            icon={<AppstoreOutlined />}
            onClick={() => setViewMode('grid')}
          />
          <Button
            type={viewMode === 'list' ? 'primary' : 'default'}
            icon={<BarsOutlined />}
            onClick={() => setViewMode('list')}
          />
        </div>
      </div>
      
      {/* 商品列表 */}
      <Spin spinning={loading}>
        <div className="mall-content">
          {viewMode === 'grid' ? (
            <Row gutter={[16, 16]}>
              {getPaginatedProducts().map(product => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <Card
                    hoverable
                    className="admin-card"
                    cover={
                      <img 
                        alt={product.name} 
                        src={product.image} 
                        style={{ height: '200px', objectFit: 'cover' }} 
                        onError={(e) => {e.target.src = DEFAULT_IMAGE}}
                      />
                    }
                    actions={[
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEditProduct(product)}
                      />,
                      <Button 
                        type="text" 
                        icon={<EyeOutlined />}
                        onClick={() => console.log('查看商品详情', product)}
                      />,
                      <Button 
                        type="text" 
                        danger
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteConfirm(product)}
                      />,
                      <Button
                        type="text"
                        icon={product.status === 'active' ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                        onClick={() => handleToggleStatus(product)}
                      />
                    ]}
                  >
                    <Badge.Ribbon 
                      text={product.status === 'active' ? '上架中' : '已下架'} 
                      color={product.status === 'active' ? 'green' : 'red'}
                    >
                      <div className="product-info">
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{product.name}</div>
                        <div className="product-price">
                          <span className="current-price">¥{product.price}</span>
                          <span className="original-price">¥{product.originalPrice}</span>
                        </div>
                        <div className="product-tags">
                          {product.tags.map((tag, index) => (
                            <Tag color="orange" key={index}>{tag}</Tag>
                          ))}
                        </div>
                        <div className="product-meta">
                          <div>ID: {product.id}</div>
                          <div className={product.stock <= 50 ? 'status-inactive' : ''}>库存: {product.stock}</div>
                          <div>销量: {product.sales}</div>
                        </div>
                      </div>
                    </Badge.Ribbon>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Table
              dataSource={products}
              columns={columns}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                onChange: handlePageChange,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 件商品`
              }}
              size="middle"
              bordered
            />
          )}
        </div>
      </Spin>
      
      {/* 只在网格视图下显示分页 */}
      {viewMode === 'grid' && products.length > 0 && (
        <div className="mall-pagination">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `共 ${total} 件商品`}
          />
        </div>
      )}
      
      {/* 添加/编辑商品弹窗 */}
      <Modal
        title={modalMode === 'add' ? '添加商品' : '编辑商品'}
        open={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        onOk={handleProductFormSubmit}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="商品分类"
                rules={[{ required: true, message: '请选择商品分类' }]}
              >
                <Select placeholder="请选择商品分类">
                  {categories.filter(cat => cat.value !== 'all').map(cat => (
                    <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="售价"
                rules={[{ required: true, message: '请输入售价' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                  placeholder="请输入售价"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="originalPrice"
                label="原价"
                rules={[{ required: true, message: '请输入原价' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                  placeholder="请输入原价"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="库存"
                rules={[{ required: true, message: '请输入库存' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入库存"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discount"
                label="折扣"
              >
                <Input placeholder="例如: 8折" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="tags"
            label="标签"
            extra="多个标签请用逗号分隔"
          >
            <Input placeholder="例如: 热销,新品,限时特惠" />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="商品图片"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={(file) => {
                // 预览图片
                const reader = new FileReader();
                reader.onload = () => {
                  setUploadedImage(reader.result);
                };
                reader.readAsDataURL(file);
                
                // 返回false阻止自动上传
                return false;
              }}
              onRemove={() => setUploadedImage(null)}
            >
              {uploadedImage || (modalMode === 'edit' && currentProduct?.image) ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
            {/* 显示上传的图片或当前商品图片预览 */}
            {(uploadedImage || (modalMode === 'edit' && currentProduct?.image)) && (
              <div style={{ marginTop: 8 }}>
                <img 
                  src={uploadedImage || currentProduct?.image} 
                  alt="商品预览" 
                  style={{ width: 200, height: 200, objectFit: 'cover' }}
                  onError={(e) => {e.target.src = DEFAULT_IMAGE}}
                />
              </div>
            )}
          </Form.Item>
          
          <Form.Item
            name="status"
            label="商品状态"
            valuePropName="checked"
            initialValue={true} // 确保初始值为上架状态
          >
            <Switch 
              checkedChildren="上架" 
              unCheckedChildren="下架" 
            />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDeleteProduct}
        okText="确认删除"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除商品 "{currentProduct?.name}" 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  )
}

export default AdminMall