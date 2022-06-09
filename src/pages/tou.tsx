import React from 'react';
import { Avatar } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
const Tou = (props:any) => (
//   <Avatar
//     size={{
//       xs: 24,
//       sm: 32,
//       md: 40,
//       lg: 64,
//       xl: 80,
//       xxl: 100,
//     }}
//     icon={<AntDesignOutlined />}
//   />
  <Avatar src={props.src}/>
);

export default Tou;