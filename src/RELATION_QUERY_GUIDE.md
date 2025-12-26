# TypeORM 关联查询学习指南

本指南演示了 NestJS + TypeORM 中各种关联关系的实际业务场景和查询方法。

## 📚 实体关系说明

### 1. 一对多关系 (OneToMany / ManyToOne)

#### User ↔ Family
- **User (一)** → **Family (多)**
- 一个用户可以拥有多个家庭
- 多个家庭属于一个用户

```typescript
// User 实体
@OneToMany(() => Family, (family) => family.user)
families: Family[];

// Family 实体
@ManyToOne(() => User, (user) => user.families)
@JoinColumn({ name: 'userId' })
user: User;
```

#### Family ↔ Pet
- **Family (一)** → **Pet (多)**
- 一个家庭可以拥有多个宠物
- 多个宠物属于一个家庭

```typescript
// Family 实体
@OneToMany(() => Pet, (pet) => pet.family)
pets: Pet[];

// Pet 实体
@ManyToOne(() => Family, (family) => family.pets)
@JoinColumn({ name: 'familyId' })
family: Family;
```

#### User ↔ Order
- **User (一)** → **Order (多)**
- 一个用户可以下多个订单
- 多个订单属于一个用户

#### Order ↔ OrderItem
- **Order (一)** → **OrderItem (多)**
- 一个订单可以有多个订单项
- 多个订单项属于一个订单

### 2. 多对多关系 (ManyToMany - 通过中间表)

#### Order ↔ Product (通过 OrderItem)
- **Order (多)** ↔ **Product (多)**
- 一个订单可以包含多个商品
- 一个商品可以出现在多个订单中
- 通过 `OrderItem` 中间表实现

```typescript
// Order 实体
@OneToMany(() => OrderItem, (orderItem) => orderItem.order)
orderItems: OrderItem[];

// Product 实体
@OneToMany(() => OrderItem, (orderItem) => orderItem.product)
orderItems: OrderItem[];

// OrderItem 实体（中间表）
@ManyToOne(() => Order, (order) => order.orderItems)
order: Order;

@ManyToOne(() => Product, (product) => product.orderItems)
product: Product;
```

## 🔍 连表查询示例

### 1. 一对多查询

#### 查询用户及其所有家庭
```typescript
// Service 方法
async findUserWithFamilies(userId: number): Promise<User> {
  return await this.userRepository.findOne({
    where: { id: userId },
    relations: ['families'], // 加载关联的 families
  });
}

// API 调用
GET /users/:id/with-families
```

#### 查询家庭及其所有宠物
```typescript
// Service 方法
async findFamilyWithPets(familyId: number): Promise<Family> {
  return await this.familyRepository.findOne({
    where: { id: familyId },
    relations: ['pets'], // 加载关联的 pets
  });
}

// API 调用
GET /family/:id/with-pets
```

### 2. 多对一查询

#### 查询宠物及其所属家庭
```typescript
// Service 方法
async findPetWithFamily(petId: number): Promise<Pet> {
  return await this.petRepository.findOne({
    where: { id: petId },
    relations: ['family'], // 加载关联的 family
  });
}

// API 调用
GET /pet/:id/with-family
```

#### 查询订单及其所属用户
```typescript
// Service 方法
async findOrderWithUser(orderId: number): Promise<Order> {
  return await this.orderRepository.findOne({
    where: { id: orderId },
    relations: ['user'], // 加载关联的 user
  });
}

// API 调用
GET /order/:id/with-user
```

### 3. 多级关联查询

#### 查询用户及其家庭和宠物（三级关联）
```typescript
// Service 方法
async findUserWithFamiliesAndPets(userId: number): Promise<User> {
  return await this.userRepository.findOne({
    where: { id: userId },
    relations: ['families', 'families.pets'], // 多级关联
  });
}

// API 调用
GET /users/:id/with-families-pets
```

#### 查询订单及其订单项和商品（三级关联）
```typescript
// Service 方法
async findOrderWithItems(orderId: number): Promise<Order> {
  return await this.orderRepository.findOne({
    where: { id: orderId },
    relations: ['orderItems', 'orderItems.product'], // 多级关联
  });
}

// API 调用
GET /order/:id/with-items
```

### 4. 条件查询 + 关联查询

#### 根据用户ID查询该用户的所有家庭
```typescript
// Service 方法
async findFamiliesByUserId(userId: number): Promise<Family[]> {
  return await this.familyRepository.find({
    where: { userId }, // 条件查询
    relations: ['pets'], // 同时加载关联数据
  });
}

// API 调用
GET /family/by-user/:userId
```

#### 根据宠物类型查询并加载家庭信息
```typescript
// Service 方法
async findPetsByTypeWithFamily(type: string): Promise<Pet[]> {
  return await this.petRepository.find({
    where: { type }, // 条件查询
    relations: ['family'], // 同时加载关联数据
  });
}

// API 调用
GET /pet/by-type/:type
```

### 5. 多对多关系查询

#### 查询订单及其所有商品（通过 OrderItem）
```typescript
// Service 方法
async findOrderWithAllRelations(orderId: number): Promise<Order> {
  return await this.orderRepository.findOne({
    where: { id: orderId },
    relations: [
      'user',                    // 订单所属用户
      'orderItems',              // 订单项
      'orderItems.product',      // 订单项对应的商品
    ],
  });
}

// API 调用
GET /order/:id/with-all
```

#### 查询商品及其所有订单
```typescript
// Service 方法
async findProductWithOrders(productId: number): Promise<Product> {
  return await this.productRepository.findOne({
    where: { id: productId },
    relations: ['orderItems', 'orderItems.order'], // 通过中间表查询
  });
}

// API 调用
GET /product/:id/with-orders
```

## 📝 业务操作示例

### 1. 创建关联数据

#### 创建家庭并关联用户
```typescript
// Service 方法
async create(createFamilyDto: CreateFamilyDto): Promise<Family> {
  // 先查询用户是否存在
  const user = await this.userRepository.findOne({
    where: { id: createFamilyDto.userId },
  });

  if (!user) {
    throw new NotFoundException('用户不存在');
  }

  // 创建家庭并关联用户
  const family = this.familyRepository.create({
    ...createFamilyDto,
    user, // 直接设置关联对象
  });

  return await this.familyRepository.save(family);
}

// API 调用
POST /family
Body: {
  "name": "张三家",
  "description": "温馨的家庭",
  "userId": 1
}
```

#### 创建订单并关联订单项和商品（事务处理）
```typescript
// Service 方法 - 使用事务确保数据一致性
async create(createOrderDto: CreateOrderDto): Promise<Order> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. 验证用户
    const user = await queryRunner.manager.findOne(User, {
      where: { id: createOrderDto.userId },
    });

    // 2. 处理订单项
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of createOrderDto.items) {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: item.productId },
      });

      // 3. 检查库存
      if (product.stock < item.quantity) {
        throw new BusinessException('库存不足');
      }

      // 4. 创建订单项
      const orderItem = queryRunner.manager.create(OrderItem, {
        product,
        quantity: item.quantity,
        price: product.price,
        subtotal: product.price * item.quantity,
      });

      orderItems.push(orderItem);
      totalAmount += orderItem.subtotal;

      // 5. 更新库存
      await queryRunner.manager.update(Product, product.id, {
        stock: product.stock - item.quantity,
      });
    }

    // 6. 创建订单
    const order = queryRunner.manager.create(Order, {
      orderNo: `ORD${Date.now()}`,
      user,
      totalAmount,
      orderItems,
    });

    const savedOrder = await queryRunner.manager.save(Order, order);

    // 7. 保存订单项
    for (const orderItem of orderItems) {
      orderItem.orderId = savedOrder.id;
      await queryRunner.manager.save(OrderItem, orderItem);
    }

    await queryRunner.commitTransaction();
    return savedOrder;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// API 调用
POST /order
Body: {
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ]
}
```

### 2. 更新关联数据

#### 更新家庭并修改关联的用户
```typescript
// Service 方法
async update(id: number, updateFamilyDto: UpdateFamilyDto): Promise<boolean> {
  // 如果更新 userId，先验证用户是否存在
  if (updateFamilyDto.userId) {
    const user = await this.userRepository.findOne({
      where: { id: updateFamilyDto.userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }
  }

  const result = await this.familyRepository.update(id, updateFamilyDto);
  return result.affected === 1;
}
```

## 🎯 API 接口列表

### User 相关接口
- `POST /users` - 创建用户
- `GET /users` - 查询所有用户
- `GET /users/with-families` - 查询所有用户及其家庭
- `GET /users/:id` - 查询单个用户
- `GET /users/:id/with-families` - 查询用户及其家庭
- `GET /users/:id/with-families-pets` - 查询用户及其家庭和宠物
- `GET /users/:id/with-orders` - 查询用户及其订单
- `PATCH /users/:id` - 更新用户
- `DELETE /users/:id` - 删除用户

### Family 相关接口
- `POST /family` - 创建家庭
- `GET /family` - 查询所有家庭
- `GET /family/with-users` - 查询所有家庭及其用户
- `GET /family/by-user/:userId` - 根据用户ID查询家庭
- `GET /family/:id` - 查询单个家庭
- `GET /family/:id/with-user` - 查询家庭及其用户
- `GET /family/:id/with-pets` - 查询家庭及其宠物
- `GET /family/:id/with-user-pets` - 查询家庭及其用户和宠物
- `PATCH /family/:id` - 更新家庭
- `DELETE /family/:id` - 删除家庭

### Pet 相关接口
- `POST /pet` - 创建宠物
- `GET /pet` - 查询所有宠物
- `GET /pet/with-family` - 查询所有宠物及其家庭
- `GET /pet/by-family/:familyId` - 根据家庭ID查询宠物
- `GET /pet/by-type/:type` - 根据类型查询宠物
- `GET /pet/:id` - 查询单个宠物
- `GET /pet/:id/with-family` - 查询宠物及其家庭
- `GET /pet/:id/with-family-user` - 查询宠物及其家庭和用户
- `PATCH /pet/:id` - 更新宠物
- `DELETE /pet/:id` - 删除宠物

### Order 相关接口
- `POST /order` - 创建订单（包含订单项）
- `GET /order` - 查询所有订单
- `GET /order/with-users` - 查询所有订单及其用户
- `GET /order/by-user/:userId` - 根据用户ID查询订单
- `GET /order/by-status?status=pending` - 根据状态查询订单
- `GET /order/:id` - 查询单个订单
- `GET /order/:id/with-user` - 查询订单及其用户
- `GET /order/:id/with-items` - 查询订单及其订单项和商品
- `GET /order/:id/with-all` - 查询订单完整信息
- `PATCH /order/:id` - 更新订单
- `DELETE /order/:id` - 删除订单

### Product 相关接口
- `POST /product` - 创建商品
- `GET /product` - 查询所有商品
- `GET /product/with-order-items` - 查询所有商品及其订单项
- `GET /product/:id` - 查询单个商品
- `GET /product/:id/with-order-items` - 查询商品及其订单项
- `GET /product/:id/with-orders` - 查询商品及其订单
- `PATCH /product/:id` - 更新商品
- `DELETE /product/:id` - 删除商品

## 💡 关键知识点

### 1. relations 参数
- 用于指定要加载的关联关系
- 支持多级关联：`['families', 'families.pets']`
- 可以同时加载多个关联：`['user', 'orderItems', 'orderItems.product']`

### 2. JoinColumn 装饰器
- 用于指定外键列名
- 在多对一关系中必须使用
- 示例：`@JoinColumn({ name: 'userId' })`

### 3. onDelete 选项
- `CASCADE`: 删除主记录时，自动删除关联记录
- `SET NULL`: 删除主记录时，将外键设置为 NULL
- 示例：`@ManyToOne(() => User, { onDelete: 'CASCADE' })`

### 4. 事务处理
- 使用 `DataSource.createQueryRunner()` 创建事务
- 确保多个操作的数据一致性
- 订单创建时同时更新库存就是典型场景

### 5. 关联查询性能优化
- 使用 `relations` 一次性加载所需数据，避免 N+1 查询问题
- 对于大量数据，考虑使用 `QueryBuilder` 进行更复杂的查询

## 🚀 快速开始

1. **启动项目**
```bash
npm run start:dev
```

2. **创建测试数据**
```bash
# 创建用户
POST /users
{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "phone": "13800138000"
}

# 创建家庭
POST /family
{
  "name": "张三家",
  "description": "温馨的家庭",
  "userId": 1
}

# 创建宠物
POST /pet
{
  "name": "小花",
  "age": 2,
  "type": "cat",
  "breed": "英短",
  "familyId": 1
}

# 创建商品
POST /product
{
  "name": "猫粮",
  "price": 99.00,
  "stock": 100
}

# 创建订单
POST /order
{
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

3. **测试关联查询**
```bash
# 查询用户及其家庭和宠物
GET /users/1/with-families-pets

# 查询订单完整信息
GET /order/1/with-all
```

## 📖 学习建议

1. **从简单到复杂**：先理解一对多关系，再学习多对多关系
2. **实践操作**：通过 API 测试工具（如 Postman）实际操作
3. **查看数据库**：观察 TypeORM 自动生成的表结构和外键关系
4. **调试 SQL**：开启 TypeORM 的日志，查看实际执行的 SQL 语句

## 🔗 相关资源

- [TypeORM 官方文档](https://typeorm.io/)
- [NestJS 官方文档](https://docs.nestjs.com/)
- [TypeORM Relations 文档](https://typeorm.io/relations)

