import React, { useEffect, useState } from 'react';
import './Registered.css';
import axios from 'axios';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

import { Button, Breadcrumb, Input, Layout, Col, Row,Popconfirm, InputNumber, Form, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import SideMenu from '../components/SideMenu';
import Cookies from "universal-cookie";

// import {EditableTable,DataType} from '../components/RegisterTable';

import { ColumnProps } from "antd/lib/table";
import "antd/dist/antd.css";


const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const cookies = new Cookies();



export interface DataType {
    // [index : string] : string| number;
    // id: string;
    key: string;
    name: string;
    address: string;
    Description: string;
    cssSelector : string;
  }

  
// type Props = {
//     iTableData : DataType[]
//     Modify(id : string) : Promise<void>,
//     Delete(id : string) : Promise<void>
// }
// function EditableTable ({iTableData, Modify, Delete} : Props)  {
//     const [tableData, setTableData] = useState<DataType[]>(iTableData);
//     const [modifyToggle, setModifyToggle] = useState<boolean>(false);

//     useEffect(() => {
//       setTableData(iTableData);
//     }, [iTableData]);
  
//     const onInputChange = (key : string, index : number) => (
//       e: React.ChangeEvent<HTMLInputElement>
//     ) => {
//     //   const newData = [...tableData];
//     //   newData[index][key] = Number(e.target.value);
//       setTableData(iTableData);
//     };
    
//     const ModifyText = (text : string) => {
//         setModifyToggle(true);


//         Modify(text);
//     }
//     const columns: ColumnProps<DataType>[] = [
//       {
//           title: 'Name',
//           dataIndex: 'title',
//           key: 'name',
//           render: (text, record, index) => (
//             <Input id="" value={text} onChange={onInputChange("name", index)} readOnly={true} />
//           )
//       },
//       {
//           title: 'Address',
//           dataIndex: 'url',
//           key: 'address',
//           render: (text, record, index) => (
//             <Input value={text} onChange={onInputChange("address", index)} readOnly={true} />
//           )
//       },
//       {
//           title: 'Description',
//           dataIndex: 'description',
//           key: 'description',
//           render: (text, record, index) => (
//             <Input value={text} onChange={onInputChange("Description", index)} readOnly={true}  />
//           )
//       },
//       {
//           title: 'operation',
//           dataIndex: 'id',
//           render: (text) => (
//               <div>
//                   <Button onClick={(e : React.MouseEvent<HTMLButtonElement>) => {
//                     if(modifyToggle == false)
//                     {
//                         e.currentTarget.value = "Apply";
//                         console.log(e.currentTarget.parentElement);
//                     }
//                     else
//                     {
//                         e.currentTarget.value = "Modify";
//                         Modify(text)
//                     }
//                   }}>modify</Button>
//                   <Button onClick={() => Delete(text)}>delete</Button>
//               </div>
//           )
//       },
//     ];
  
//     return (
//       <div style={{ padding: 20 }}>
//         <Table
//           rowKey="id"
//           columns={columns}
//           dataSource={tableData}
//           pagination={false}
//         />
  
//       </div>
//     );
//   };



interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: DataType;
    index: number;
    children: React.ReactNode;
  }
  
  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  
export default function Registered() {

    const [name, SetName] = React.useState("");
    const [address, SetAddress] = React.useState("");
    const [description, SetDescription] = React.useState("");
    const [css, SetCSS] = React.useState("");
    const [collapsed, setCollapsed] = useState(false);
    const [datas, setDatas] = useState<DataType[]>([]);

//table
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', address: '', description: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id : string, key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...datas];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDatas(newData);
        // handleModify(id,item);
        setEditingKey('');
      } else {
        newData.push(row);
        setDatas(newData);
        // handleModify(id,item);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'name',
    //   width: '25%',
      editable: true,
    },
    {
      title: 'Address',
      dataIndex: 'url',
      key: 'address',
    //   width: '15%',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    //   width: '40%',
      editable: true,
    },
    {
        title: 'CSS Selector',
        dataIndex: 'cssSelector',
        key : 'cssSelector',
        editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'id',
      render: (text:string, record: DataType,index:number) => {
        const editable = isEditing(record);
        return   <div>
            {editable ? (
          <span>
            <Typography.Link onClick={() => save(text,record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        ) }
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>
            <Typography.Link onClick={() => handleDelete(text)} style={{ marginRight: 8 }}>
                Delete
            </Typography.Link>
        </span>
        </div>
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

//====
    
    const getSites = async () => {
        try {
            const response = await axios({
                url: "api/sites",
                method: "get",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
            });
            setDatas(response.data);
            console.log(response.data)
        }
        catch (ex) {
            message.error("Can't get sites")
            return;
        }
    }

    const handleModify = async (id: string, record: DataType) => {
        try {
            const response = await axios({
                url: `api/site/${id}`,
                method: "put",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
                data:{
                    title: record.name,
                    url: record.address,
                    crawlUrl: record.address,
                    cssSelector: record.cssSelector,
                }
            });
            getSites();

        }
        catch (ex) {
            message.error("Can't remove sites");
            return;
        }
    }

    const handleDelete = async (id: string) => {
        try {
            console.log(id);
            const response = await axios({
                url: `api/site/${id}`,
                method: "delete",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
                data:{
                    deleteAllPages: true
                }
            });
            getSites();

        }
        catch (ex) {
            message.error("Can't remove sites");
            return;
        }
    };


    const addSite = async () => {
        if (name === "") {
            message.error("Please type name");
            return;
        }
        if (address === "") {
            message.error("Please type address");
            return;
        }
        try {
            const response = await axios({
                url: "api/site",
                method: "post",
                headers: {
                    "x-access-token": cookies.get('access_token')
                },
                data: {
                    title: name,
                    url: address,
                    crawlUrl: address,
                    cssSelector: css
                }
            });
            console.log(response.status)
            getSites()
        }
        catch (ex) {
            message.error("Can't add site");
            return;
        }
    }


    useEffect(()=>{
        getSites();
    },[]);

    return (
        <Layout style={{ minHeight: '100vh' }}>

            <Header className="site-layout-background" style={{ padding: 0 }}>
                <Row>
                    <Col>
                        <Button className="Menu-Button" onClick={() => setCollapsed((prev) => !prev)} style={{ marginBottom: 16 }}>
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                    </Col>
                    <Col>
                        <div><h1 className="title">Web Page Storage</h1></div>
                    </Col>
                </Row>
            </Header>
            <Layout className="site-layout">
                <Sider collapsible collapsed={collapsed} trigger={null} onCollapse={value => setCollapsed(value)} collapsedWidth="0">
                    <SideMenu />
                </Sider>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item className='Category-title'>
                            Registered Sites
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    {/* <Table columns={columns} dataSource={datas} /> */}
                    {/* <EditableTable iTableData={datas} Modify={handleModify} Delete={handleDelete}/> */}
                    <Form form={form} component={false}>
                        <Table
                            components={{
                            body: {
                                cell: EditableCell,
                            },
                            }}
                            bordered
                            dataSource={datas}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={{
                            onChange: cancel,
                            }}
                        />
                    </Form>
                    <Row justify='center'>
                        <Col >
                            <Text strong>New Site</Text>
                        </Col>
                        <Col offset={1}>
                            <Input
                                id="Name"
                                placeholder="Name"
                                value={name}
                                onChange={({ target: { value } }) => SetName(value)}
                            />
                        </Col>
                        <Col>
                            <Input
                                id="Address"
                                placeholder="Address"
                                value={address}
                                onChange={({ target: { value } }) => SetAddress(value)}
                            />
                        </Col>
                        <Col>
                            <Input
                                id="Description"
                                placeholder="Description"
                                value={description}
                                onChange={({ target: { value } }) => SetDescription(value)}
                            />
                        </Col>
                        <Col>
                            <Input
                                id="CSS"
                                placeholder="CSS"
                                value={css}
                                onChange={({ target: { value } }) => SetCSS(value)}
                            />
                        </Col>
                        <Col>
                            <Button onClick={addSite}>Add</Button>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}