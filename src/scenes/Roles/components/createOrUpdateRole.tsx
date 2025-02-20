import React, { useState, useEffect, Key } from "react";
import { Modal, Tabs, Form, Input, Tree } from "antd";
import { GetAllPermissionsOutput } from "../../../services/role/dto/getAllPermissionsOutput";
import { L } from "../../../lib/abpUtility";
import RoleStore from "../../../stores/roleStore";
import { FormInstance } from "antd/lib/form";
import { TreeProps } from "antd/es/tree";

type DataNode = Exclude<TreeProps["treeData"], undefined>[number];

const { TabPane } = Tabs;
const { Search } = Input;

export interface ICreateOrUpdateRoleProps {
  roleStore: RoleStore;
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: () => void;
  permissions: GetAllPermissionsOutput[];
  formRef: React.RefObject<FormInstance>;
}

const CreateOrUpdateRole: React.FC<ICreateOrUpdateRoleProps> = (props) => {
  const { permissions, visible, formRef } = props;
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [searchValue, setSearchValue] = useState("");

  // Build tree from permissions
  const buildPermissionTree = (permissions: GetAllPermissionsOutput[]): DataNode[] => {
    const map = new Map<string, DataNode>();

    permissions.forEach((permission) => {
      const node: DataNode = {
        title: permission.displayName,
        key: permission.name,
        children: [],
      };
      map.set(permission.name, node);
    });

    const tree: DataNode[] = [];

    permissions.forEach((permission) => {
      if (permission.parentName && map.has(permission.parentName)) {
        map.get(permission.parentName)!.children!.push(map.get(permission.name)!);
      } else {
        tree.push(map.get(permission.name)!);
      }
    });

    return tree;
  };

  // Collect all keys for expansion
  const getAllKeys = (nodes: DataNode[]): Key[] => {
    let keys: Key[] = [];
    nodes.forEach((node) => {
      keys.push(node.key);
      if (node.children && node.children.length > 0) {
        keys = keys.concat(getAllKeys(node.children));
      }
    });
    return keys;
  };

  useEffect(() => {
    const builtTree = buildPermissionTree(permissions);
    setTreeData(builtTree);
    setExpandedKeys(getAllKeys(builtTree)); // Expand all nodes by default
  }, [permissions]);

  useEffect(() => {
    if (props.visible && props.roleStore.roleEdit.role) {
      const roleData = props.roleStore.roleEdit.role;
      const grantedPermissions = props.roleStore.roleEdit.grantedPermissionNames || [];
  
      props.formRef.current?.setFieldsValue({
        ...roleData,
        grantedPermissionNames: grantedPermissions,
      });
  
      setCheckedKeys(grantedPermissions); // Ensure checkboxes reflect the state
    }
  }, [props.visible, props.roleStore.roleEdit]);
  

  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    const newCheckedKeys = Array.isArray(checkedKeysValue) ? checkedKeysValue : checkedKeysValue.checked;
    
    setCheckedKeys(newCheckedKeys);
    
    props.formRef.current?.setFieldsValue({
      grantedPermissionNames: newCheckedKeys,
    });
  };
  

  // Search filter function
  const filterTreeData = (data: DataNode[], searchText: string): DataNode[] => {
    if (!searchText) return data;

    return data
      .map((node) => {
        const isMatch = node.title?.toString().toLowerCase().includes(searchText.toLowerCase());
        if (node.children) {
          const filteredChildren = filterTreeData(node.children, searchText);
          if (isMatch || filteredChildren.length > 0) {
            return { ...node, children: filteredChildren };
          }
        }
        return isMatch ? { ...node } : null;
      })
      .filter(Boolean) as DataNode[];
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
    setExpandedKeys(getAllKeys(treeData)); // Expand all nodes when searching
  };

  return (
    <Modal
      visible={visible}
      cancelText={L("Cancel")}
      okText={L("Save")}
      onCancel={props.onCancel}
      title={L("Role")}
      onOk={props.onOk}
      destroyOnClose={true}
    >
      <Form ref={formRef} layout="vertical">
        <Tabs defaultActiveKey={"role"} size={"small"} tabBarGutter={64}>
          <TabPane tab={L("RoleDetails")} key={"role"}>
            <Form.Item label={L("RoleName")} name={"name"}>
              <Input />
            </Form.Item>
          </TabPane>
          <TabPane tab={L("RolePermission")} key={"permission"} forceRender={true}>
            <Form.Item name={"grantedPermissionNames"}>
              <Search placeholder="Search Permissions" allowClear onChange={(e) => onSearch(e.target.value)} style={{ marginBottom: 8 }} />
              <Tree
                checkable
                selectable={false}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                treeData={filterTreeData(treeData, searchValue)}
                expandedKeys={expandedKeys}
              />
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateRole;
