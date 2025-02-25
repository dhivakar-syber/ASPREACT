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

  // Permission Tree Map
  const permissionMap = new Map<string, string | null>();

  const buildPermissionTree = (permissions: GetAllPermissionsOutput[]): DataNode[] => {
    const map = new Map<string, DataNode>();

    permissions.forEach((permission) => {
      const node: DataNode = {
        title: permission.displayName,
        key: permission.name,
        children: [],
      };
      map.set(permission.name, node);
      permissionMap.set(permission.name, permission.parentName || null);
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
    setExpandedKeys(getAllKeys(builtTree));
  }, [permissions]);

  useEffect(() => {
    if (props.visible && props.roleStore.roleEdit.role) {
      const roleData = props.roleStore.roleEdit.role;
      const grantedPermissions = props.roleStore.roleEdit.grantedPermissionNames || [];

      props.formRef.current?.setFieldsValue({
        ...roleData,
        grantedPermissionNames: grantedPermissions,
      });

      setCheckedKeys(grantedPermissions);
    }
  }, [props.visible, props.roleStore.roleEdit]);
  const getAllChildKeys = (parentKey: string): string[] => {
    const findChildren = (nodes: DataNode[], parentKey: string): string[] => {
      let keys: string[] = [];
  
      nodes.forEach((node) => {
        if (String(node.key) === parentKey) {
          node.children?.forEach((child) => {
            keys.push(String(child.key));
            Array.prototype.push.apply(keys, findChildren(child.children || [], String(child.key)));
          });
        } else if (node.children) {
          Array.prototype.push.apply(keys, findChildren(node.children, parentKey));
        }
      });
  
      return keys;
    };
  
    return findChildren(treeData, parentKey);
  };
  

  const getAllParentKeys = (key: string): string[] => {
    let parents: string[] = [];
    let current = key;
    while (permissionMap.has(current)) {
      const parent = permissionMap.get(current);
      if (parent) {
        parents.push(parent);
        current = parent;
      } else {
        break;
      }
    }
    return parents;
  };
  const onCheck = (checked: Key[] | { checked: Key[]; halfChecked: Key[] }, info: any) => {
    const checkedKeysArray = Array.isArray(checked) ? checked : checked.checked;
    let newCheckedKeys = new Set<Key>(checkedKeysArray.map(String)); // Ensure all keys are strings
  
    if (info.checked) {
      console.log(info)
      // Check parent nodes up the chain
      getAllParentKeys(info.node.key).forEach((parent) => newCheckedKeys.add(parent));

    } else {
      // If all children are unchecked, remove parent check
      const childKeys = getAllChildKeys(info.node.key);
      const stillCheckedChildren = childKeys.some((child) => newCheckedKeys.has(child));

      if (!stillCheckedChildren) {
        getAllParentKeys(info.node.key).forEach((parent) => {
          const siblingKeys = getAllChildKeys(parent);
          const isSiblingChecked = siblingKeys.some((child) => newCheckedKeys.has(child));

          if (!isSiblingChecked) {
            newCheckedKeys.delete(parent);
          }
        });
      }
    }

    setCheckedKeys(Array.from(newCheckedKeys).map(String));

    props.formRef.current?.setFieldsValue({
      grantedPermissionNames: Array.from(newCheckedKeys),
    });
  };

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
    setExpandedKeys(getAllKeys(treeData));
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
                checkStrictly
                selectable={true}
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
