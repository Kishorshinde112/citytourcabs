export const isCmsAdmin = ({ req }: { req: { user?: any } }) =>
  req.user?.collection === 'users' && req.user?.role === 'admin';
