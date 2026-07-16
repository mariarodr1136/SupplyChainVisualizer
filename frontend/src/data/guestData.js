const deepClone = (value) => JSON.parse(JSON.stringify(value));

const initialNodes = [
  {
    id: 1,
    name: 'Pacific Components Factory',
    type: 'factory',
    latitude: 37.7749,
    longitude: -122.4194,
    capacity: 8500,
    status: 'active'
  },
  {
    id: 2,
    name: 'Central Warehouse',
    type: 'warehouse',
    latitude: 41.8781,
    longitude: -87.6298,
    capacity: 12000,
    status: 'active'
  },
  {
    id: 3,
    name: 'Northeast Distribution Center',
    type: 'warehouse',
    latitude: 40.7128,
    longitude: -74.006,
    capacity: 9500,
    status: 'warning'
  },
  {
    id: 4,
    name: 'Austin Retail Hub',
    type: 'store',
    latitude: 30.2672,
    longitude: -97.7431,
    capacity: 3200,
    status: 'active'
  },
  {
    id: 5,
    name: 'Seattle Supplier',
    type: 'supplier',
    latitude: 47.6062,
    longitude: -122.3321,
    capacity: 6000,
    status: 'active'
  },
  {
    id: 6,
    name: 'Atlanta Store',
    type: 'store',
    latitude: 33.749,
    longitude: -84.388,
    capacity: 2800,
    status: 'inactive'
  }
];

const initialProducts = [
  {
    id: 1,
    sku: 'SC-1001',
    name: 'Lithium Battery Pack',
    category: 'Energy',
    weight: 12.5,
    price: 420
  },
  {
    id: 2,
    sku: 'SC-1002',
    name: 'Control Module',
    category: 'Electronics',
    weight: 2.1,
    price: 210
  },
  {
    id: 3,
    sku: 'SC-1003',
    name: 'Sensor Kit',
    category: 'Components',
    weight: 0.8,
    price: 85
  },
  {
    id: 4,
    sku: 'SC-1004',
    name: 'Packaging Set',
    category: 'Packaging',
    weight: 1.2,
    price: 15
  },
  {
    id: 5,
    sku: 'SC-1005',
    name: 'Motor Assembly',
    category: 'Mechanical',
    weight: 18.4,
    price: 560
  },
  {
    id: 6,
    sku: 'SC-1006',
    name: 'Wiring Harness',
    category: 'Electrical',
    weight: 3.5,
    price: 40
  }
];

const initialInventory = [
  {
    id: 501,
    nodeId: 2,
    productId: 1,
    quantity: 120,
    minThreshold: 150,
    maxThreshold: 500,
    updatedAt: '2026-03-08T14:30:00Z'
  },
  {
    id: 502,
    nodeId: 2,
    productId: 2,
    quantity: 420,
    minThreshold: 200,
    maxThreshold: 600,
    updatedAt: '2026-03-12T09:15:00Z'
  },
  {
    id: 503,
    nodeId: 3,
    productId: 3,
    quantity: 40,
    minThreshold: 60,
    maxThreshold: 200,
    updatedAt: '2026-03-11T16:45:00Z'
  },
  {
    id: 504,
    nodeId: 1,
    productId: 5,
    quantity: 35,
    minThreshold: 50,
    maxThreshold: 120,
    updatedAt: '2026-03-10T12:00:00Z'
  },
  {
    id: 505,
    nodeId: 4,
    productId: 4,
    quantity: 900,
    minThreshold: 200,
    maxThreshold: 800,
    updatedAt: '2026-03-09T10:20:00Z'
  },
  {
    id: 506,
    nodeId: 6,
    productId: 6,
    quantity: 20,
    minThreshold: 40,
    maxThreshold: 150,
    updatedAt: '2026-03-07T08:05:00Z'
  }
];

const initialConnections = [
  {
    id: 301,
    sourceId: 5,
    targetId: 1,
    transportationType: 'ship',
    travelTime: 36,
    distance: 1400,
    costPerUnit: 2.4,
    status: 'active',
    riskLevel: 'medium',
    performanceLevel: 'high'
  },
  {
    id: 302,
    sourceId: 1,
    targetId: 2,
    transportationType: 'train',
    travelTime: 28,
    distance: 2100,
    costPerUnit: 1.8,
    status: 'active',
    riskLevel: 'low',
    performanceLevel: 'high'
  },
  {
    id: 303,
    sourceId: 2,
    targetId: 3,
    transportationType: 'truck',
    travelTime: 16,
    distance: 1200,
    costPerUnit: 2.2,
    status: 'delayed',
    riskLevel: 'high',
    performanceLevel: 'low'
  },
  {
    id: 304,
    sourceId: 2,
    targetId: 4,
    transportationType: 'truck',
    travelTime: 14,
    distance: 980,
    costPerUnit: 1.9,
    status: 'active',
    riskLevel: 'medium',
    performanceLevel: 'medium'
  },
  {
    id: 305,
    sourceId: 2,
    targetId: 6,
    transportationType: 'air',
    travelTime: 6,
    distance: 950,
    costPerUnit: 3.6,
    status: 'at_capacity',
    riskLevel: 'medium',
    performanceLevel: 'medium'
  }
];

const initialShipments = [
  {
    id: 9001,
    sourceId: 1,
    destinationId: 2,
    status: 'in_transit',
    createdAt: '2026-03-10T08:20:00Z',
    departureDate: '2026-03-12',
    estimatedArrival: '2026-03-20',
    items: [
      { productId: 5, productName: 'Motor Assembly', quantity: 20 },
      { productId: 2, productName: 'Control Module', quantity: 40 }
    ]
  },
  {
    id: 9002,
    sourceId: 2,
    destinationId: 3,
    status: 'delayed',
    createdAt: '2026-03-04T10:05:00Z',
    departureDate: '2026-03-05',
    estimatedArrival: '2026-03-12',
    items: [
      { productId: 3, productName: 'Sensor Kit', quantity: 120 }
    ]
  },
  {
    id: 9003,
    sourceId: 5,
    destinationId: 1,
    status: 'pending',
    createdAt: '2026-03-18T15:40:00Z',
    departureDate: '2026-03-21',
    estimatedArrival: '2026-03-27',
    items: [
      { productId: 1, productName: 'Lithium Battery Pack', quantity: 80 }
    ]
  },
  {
    id: 9004,
    sourceId: 2,
    destinationId: 4,
    status: 'delivered',
    createdAt: '2026-02-20T09:00:00Z',
    departureDate: '2026-02-20',
    estimatedArrival: '2026-02-25',
    actualArrival: '2026-02-24T14:10:00Z',
    items: [
      { productId: 4, productName: 'Packaging Set', quantity: 300 }
    ]
  },
  {
    id: 9005,
    sourceId: 1,
    destinationId: 3,
    status: 'delivered',
    createdAt: '2026-01-15T07:30:00Z',
    departureDate: '2026-01-15',
    estimatedArrival: '2026-01-22',
    actualArrival: '2026-01-25T11:20:00Z',
    items: [
      { productId: 5, productName: 'Motor Assembly', quantity: 45 }
    ]
  },
  {
    id: 9006,
    sourceId: 5,
    destinationId: 1,
    status: 'delivered',
    createdAt: '2026-01-05T06:00:00Z',
    departureDate: '2026-01-05',
    estimatedArrival: '2026-01-08',
    actualArrival: '2026-01-07T09:45:00Z',
    items: [
      { productId: 1, productName: 'Lithium Battery Pack', quantity: 60 }
    ]
  }
];

let nodes = deepClone(initialNodes);
let products = deepClone(initialProducts);
let inventory = deepClone(initialInventory);
let connections = deepClone(initialConnections);
let shipments = deepClone(initialShipments);

let nextNodeId = Math.max(...nodes.map((n) => n.id)) + 1;
let nextProductId = Math.max(...products.map((p) => p.id)) + 1;
let nextInventoryId = Math.max(...inventory.map((i) => i.id)) + 1;
let nextConnectionId = Math.max(...connections.map((c) => c.id)) + 1;
let nextShipmentId = Math.max(...shipments.map((s) => s.id)) + 1;

const getNodeName = (nodeId) => nodes.find((node) => node.id === Number(nodeId))?.name;
const getProductName = (productId) => products.find((product) => product.id === Number(productId))?.name;

const getInventoryStatus = (quantity, minThreshold, maxThreshold) => {
  if (minThreshold !== undefined && minThreshold !== null) {
    if (quantity <= minThreshold * 0.5) {
      return 'critical';
    }
    if (quantity < minThreshold) {
      return 'low';
    }
  }
  if (maxThreshold !== undefined && maxThreshold !== null && quantity > maxThreshold) {
    return 'excess';
  }
  return 'optimal';
};

const enrichInventoryItem = (item) => {
  const minThreshold = item.minThreshold ?? 0;
  const maxThreshold = item.maxThreshold ?? null;
  const quantity = item.quantity ?? 0;
  return {
    ...item,
    nodeName: getNodeName(item.nodeId) || item.nodeName || 'Unknown Location',
    productName: getProductName(item.productId) || item.productName || 'Unknown Product',
    minThreshold,
    maxThreshold,
    status: getInventoryStatus(quantity, minThreshold, maxThreshold),
    updatedAt: item.updatedAt || new Date().toISOString()
  };
};

const enrichShipment = (shipment) => ({
  ...shipment,
  sourceName: getNodeName(shipment.sourceId) || shipment.sourceName || 'Unknown Source',
  destinationName: getNodeName(shipment.destinationId) || shipment.destinationName || 'Unknown Destination',
  items: (shipment.items || []).map((item) => ({
    ...item,
    productName: getProductName(item.productId) || item.productName || 'Unknown Product'
  }))
});

export const guestDataApi = {
  getNodes() {
    return deepClone(nodes);
  },
  getNodeById(id) {
    const node = nodes.find((item) => item.id === Number(id));
    return node ? deepClone(node) : null;
  },
  createNode(node) {
    const newNode = {
      ...node,
      id: nextNodeId++
    };
    nodes = [...nodes, newNode];
    return deepClone(newNode);
  },
  updateNode(id, node) {
    const index = nodes.findIndex((item) => item.id === Number(id));
    const updatedNode = { ...node, id: Number(id) };
    if (index >= 0) {
      nodes = nodes.map((item) => (item.id === Number(id) ? updatedNode : item));
    } else {
      nodes = [...nodes, updatedNode];
    }
    return deepClone(updatedNode);
  },
  deleteNode(id) {
    const nodeId = Number(id);
    nodes = nodes.filter((item) => item.id !== nodeId);
    inventory = inventory.filter((item) => item.nodeId !== nodeId);
    connections = connections.filter(
      (item) => item.sourceId !== nodeId && item.targetId !== nodeId
    );
    shipments = shipments.filter(
      (item) => item.sourceId !== nodeId && item.destinationId !== nodeId
    );
    return true;
  },
  getProducts() {
    return deepClone(products);
  },
  getProductById(id) {
    const product = products.find((item) => item.id === Number(id));
    return product ? deepClone(product) : null;
  },
  createProduct(product) {
    const newProduct = {
      ...product,
      id: nextProductId++
    };
    products = [...products, newProduct];
    return deepClone(newProduct);
  },
  updateProduct(id, product) {
    const index = products.findIndex((item) => item.id === Number(id));
    const updatedProduct = { ...product, id: Number(id) };
    if (index >= 0) {
      products = products.map((item) => (item.id === Number(id) ? updatedProduct : item));
    } else {
      products = [...products, updatedProduct];
    }
    return deepClone(updatedProduct);
  },
  deleteProduct(id) {
    const productId = Number(id);
    products = products.filter((item) => item.id !== productId);
    inventory = inventory.filter((item) => item.productId !== productId);
    shipments = shipments.map((shipment) => ({
      ...shipment,
      items: (shipment.items || []).filter((item) => item.productId !== productId)
    }));
    return true;
  },
  getInventory() {
    return deepClone(inventory.map(enrichInventoryItem));
  },
  getInventoryByNode(nodeId) {
    return deepClone(
      inventory.filter((item) => item.nodeId === Number(nodeId)).map(enrichInventoryItem)
    );
  },
  getInventoryByProduct(productId) {
    return deepClone(
      inventory.filter((item) => item.productId === Number(productId)).map(enrichInventoryItem)
    );
  },
  getLowStockInventory() {
    return deepClone(
      inventory
        .map(enrichInventoryItem)
        .filter((item) => item.status === 'low' || item.status === 'critical')
    );
  },
  createOrUpdateInventory(item) {
    if (item.id) {
      return this.updateInventory(item.id, item);
    }
    const newItem = enrichInventoryItem({
      ...item,
      id: nextInventoryId++
    });
    inventory = [...inventory, newItem];
    return deepClone(newItem);
  },
  updateInventory(id, item) {
    const updatedItem = enrichInventoryItem({
      ...item,
      id: Number(id),
      updatedAt: new Date().toISOString()
    });
    const index = inventory.findIndex((existing) => existing.id === Number(id));
    if (index >= 0) {
      inventory = inventory.map((existing) => (existing.id === Number(id) ? updatedItem : existing));
    } else {
      inventory = [...inventory, updatedItem];
    }
    return deepClone(updatedItem);
  },
  deleteInventory(id) {
    inventory = inventory.filter((item) => item.id !== Number(id));
    return true;
  },
  getConnections() {
    return deepClone(connections);
  },
  getConnectionById(id) {
    const connection = connections.find((item) => item.id === Number(id));
    return connection ? deepClone(connection) : null;
  },
  createConnection(connection) {
    const newConnection = {
      ...connection,
      id: nextConnectionId++
    };
    connections = [...connections, newConnection];
    return deepClone(newConnection);
  },
  updateConnection(id, connection) {
    const updatedConnection = { ...connection, id: Number(id) };
    const index = connections.findIndex((item) => item.id === Number(id));
    if (index >= 0) {
      connections = connections.map((item) =>
        item.id === Number(id) ? updatedConnection : item
      );
    } else {
      connections = [...connections, updatedConnection];
    }
    return deepClone(updatedConnection);
  },
  deleteConnection(id) {
    connections = connections.filter((item) => item.id !== Number(id));
    return true;
  },
  getShipments() {
    return deepClone(shipments.map(enrichShipment));
  },
  getShipmentById(id) {
    const shipment = shipments.find((item) => item.id === Number(id));
    return shipment ? deepClone(enrichShipment(shipment)) : null;
  },
  createShipment(shipment) {
    const newShipment = enrichShipment({
      ...shipment,
      id: nextShipmentId++,
      status: shipment.status || 'pending',
      createdAt: new Date().toISOString()
    });
    shipments = [...shipments, newShipment];
    return deepClone(newShipment);
  },
  updateShipment(id, shipment) {
    const updatedShipment = enrichShipment({
      ...shipment,
      id: Number(id)
    });
    const index = shipments.findIndex((item) => item.id === Number(id));
    if (index >= 0) {
      shipments = shipments.map((item) => (item.id === Number(id) ? updatedShipment : item));
    } else {
      shipments = [...shipments, updatedShipment];
    }
    return deepClone(updatedShipment);
  },
  updateShipmentStatus(id, status) {
    const shipment = shipments.find((item) => item.id === Number(id));
    if (!shipment) return null;
    const updatedShipment = {
      ...shipment,
      status
    };
    if (status === 'delivered' && !updatedShipment.actualArrival) {
      updatedShipment.actualArrival = new Date().toISOString();
    }
    shipments = shipments.map((item) => (item.id === Number(id) ? updatedShipment : item));
    return deepClone(enrichShipment(updatedShipment));
  },
  deleteShipment(id) {
    shipments = shipments.filter((item) => item.id !== Number(id));
    return true;
  }
};

