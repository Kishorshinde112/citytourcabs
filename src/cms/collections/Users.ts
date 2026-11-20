import type { CollectionConfig } from 'payload';
const admin = (user: any) => user?.collection === 'users' && user?.role === 'admin';
const staff = (user: any) => user?.collection === 'users' && ['admin','operator'].includes(user?.role);

export const Users: CollectionConfig = {
  slug:'users',
  admin:{useAsTitle:'email',group:'User Administration'},
  auth:true,
  access:{
    // Initial super-admin bootstrap allowed only when there are zero users.
    create: async ({req}) => {
      if (admin(req.user)) return true;
      const existing = await req.payload.count({collection:'users',overrideAccess:true});
      return existing.totalDocs === 0;
    },
    read:({req})=> admin(req.user) ? true : (staff(req.user) ? {id:{equals:req.user.id}} : false),
    update:({req})=> admin(req.user) ? true : (staff(req.user) ? {id:{equals:req.user.id}} : false),
    delete:({req})=>admin(req.user),
  },
  fields:[
    {name:'name',type:'text',required:true},
    {name:'role',type:'select',defaultValue:'admin',required:true,
      options:[{label:'Admin',value:'admin'},{label:'Staff / Operator',value:'operator'}],
      access:{update:({req})=>admin(req.user)},
    },
  ],
};
