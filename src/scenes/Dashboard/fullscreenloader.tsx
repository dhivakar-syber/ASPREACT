import React from "react";
import { Spin } from 'antd';

const FullScreenLoader = () => {
  
  return (
    <div >
      <div style={{ paddingTop: 100, textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      
    </div>
  );
};

export default FullScreenLoader;
