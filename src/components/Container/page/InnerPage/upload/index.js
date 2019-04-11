import React, {Component} from 'react';
import {Button, Upload, Card, Icon, message} from 'antd'
import Config from 'app/common';


class UploadFile extends Component {
    constructor(props) {
        super(props);
    }


    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }


    render() {
        const props = {
            name: 'wordFile',
            action: `/api/manager/admin/${Config.getUserInfo() == null ? '*' : Config.getUserInfo().username}/word/upload`,
            headers: {
                authorization: 'authorization-text',
            },
        }
        return (
            <div>
                <Card title="试卷上传">
                    <Upload {...props} onChange={this.onChange}>
                        <Button>
                            <Icon type="upload"/> 点击上传试卷
                        </Button>
                    </Upload>
                </Card>
            </div>
        );
    }
}

export default UploadFile;