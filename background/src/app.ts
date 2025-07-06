import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import menuItemsRouter from './routes/menuItems';
import ordersRouter from './routes/orders';
import usersRouter from './routes/users';
import reviewsRouter from './routes/reviews';
import { fail } from './utils/response';

const app = express();
const port = process.env.PORT || 10110;

// 创建HTTP服务器
const server = createServer(app);

// 创建WebSocket服务器
const wss = new WebSocketServer({ server, path: '/ws/orders' });

// 存储所有连接的客户端
const clients = new Set<WebSocket>();

// WebSocket连接处理
wss.on('connection', (ws: WebSocket) => {
  console.log('新的WebSocket连接');
  clients.add(ws);

  ws.on('close', () => {
    console.log('WebSocket连接关闭');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket错误:', error);
    clients.delete(ws);
  });
});

// 广播订单更新
export function broadcastOrderUpdate(orderId: number) {
  const message = JSON.stringify({
    type: 'ORDER_UPDATE',
    data: { orderId }
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// CORS配置
const corsOptions = {
  origin: '*', // 在生产环境中应该设置为具体的域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json());

// 路由
app.use('/api/menu-items', menuItemsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/reviews', reviewsRouter);

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  fail(res, 500, '服务器内部错误');
});

// 启动服务器
if (require.main === module) {
  server.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log(`WebSocket服务器运行在 ws://localhost:${port}/ws/orders`);
  });
}

export default server; 