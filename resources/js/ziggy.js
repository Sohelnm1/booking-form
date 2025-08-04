const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"welcome":{"uri":"\/","methods":["GET","HEAD"]},"login":{"uri":"login","methods":["GET","HEAD"]},"register":{"uri":"register","methods":["GET","HEAD"]},"logout":{"uri":"logout","methods":["POST"]},"customer.dashboard":{"uri":"customer\/dashboard","methods":["GET","HEAD"]},"employee.dashboard":{"uri":"employee\/dashboard","methods":["GET","HEAD"]},"admin.dashboard":{"uri":"admin\/dashboard","methods":["GET","HEAD"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
