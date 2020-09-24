import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import bc from 'bcryptjs';
import { useHistory } from 'react-router-dom';

import { ArrowLeftOutlined } from '@ant-design/icons';

import { getProfileData } from '../../../api';

import { Modal, Button, Form, Input } from 'antd';
import Header from '../../common/Header';

const titleText =
  'So we can direct you to the right place, please let us know who you are.';

const ProfileRenderModal = props => {
  const { authState } = useOktaAuth();
  const [visible, setVisible] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState(titleText);
  const [form] = Form.useForm();
  const history = useHistory();

  const onFinish = values => {
    history.push(`${selected.type.toLowerCase()}/dashboard`);
  };

  useEffect(() => {
    getProfileData(authState).then(res => {
      setUserInfo(res);
    });
  }, [authState]);

  const handleOk = e => {
    setVisible(true);
  };

  const handleCancel = e => {
    setVisible(true);
  };

  const userSelect = user => {
    setSelected(user);
    setTitle(null);
  };

  const backToProfiles = e => {
    setSelected(!selected);
    setTitle(titleText);
  };

  return (
    <>
      <Header />
      {
        <Modal
          className="profile-modal"
          title={title}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          closable={false}
          centered={true}
          footer={null}
        >
          {!selected ? (
            <div className="button-list">
              {userInfo.map(user => {
                return (
                  <Button
                    type="primary"
                    size="large"
                    key={`${user.type}-${user.ID}`}
                    onClick={e => userSelect(user)}
                  >
                    {user.Name}
                  </Button>
                );
              })}
            </div>
          ) : (
            <Form form={form} onFinish={onFinish}>
              <p>Enter your PIN</p>
              <Form.Item
                name="pin"
                validateTrigger="onSubmit"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Incorrect PIN!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      const x = bc.compareSync(value, selected.PIN);
                      if (x) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Your pin does not match!');
                    },
                  }),
                ]}
              >
                <Input className="pin" maxLength={4} />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Enter
              </Button>

              <Button
                className="back"
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={backToProfiles}
              />
            </Form>
          )}
        </Modal>
      }
    </>
  );
};

export default ProfileRenderModal;