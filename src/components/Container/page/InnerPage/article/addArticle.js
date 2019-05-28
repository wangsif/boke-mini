import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import { Form, Input, Button ,formItemLayout ,Upload, message, Icon} from 'antd'
const FormItem = Form.Item;
import ArticleAction from "../../../../../action/ArticleAction";
import RestAPI from "../../../../../utils/rest-api";




class AddArticle extends React.Component {



    constructor(props) {
        super(props);
        this.state={
            imageUrl:""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount () {

        // 异步设置编辑器内容
        setTimeout(() => {
            this.props.form.setFieldsValue({
                //content: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>')
            })
        }, 1000)

    }
    // handleSubmit(e) {
    //     let _self = this;
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         if (!err) {
    //             let {onEditSubmit, editClassifyData} = this.props;
    //             let {title,image,content} = values;
    //
    //             console.log(values)
    //             onEditSubmit && onEditSubmit(title,image,content);
    //         }
    //     });
    // }
    onChange=(info)=> {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList)
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            this.setState({imageUrl:info.file.response.imageUrl})
            console.log(info.file.response.imageUrl)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    addData = ( {title,image,content}) => {
        RestAPI.request(`/api/app/article/addArticle`,
            {
                "title":title,
                "image":image,
                "content":content
            },
            'POST',
            true
        ).then((data) => {
            this.showEditModal(false);
            ArticleAction.fetchData();
            message.success('添加成功！');

            console.log(1234)
        }).catch(error => {
            message.error('添加失败！' + error.message);
        });
    }

    handleSubmit = (event) => {

        event.preventDefault()
        const {imageUrl} = this.state

        this.props.form.validateFields((error, values) => {
            if (!error) {
                const submitData = {
                    title: values.title,
                    image:imageUrl,
                    content: values.content.toRAW()// or values.content.toHTML()
                }
                this.addData(submitData);
                console.log(values)
                console.log(submitData)
            }
        })

    }


    showEditModal = (show) => {
        ArticleAction.showEditModal(show);
    }



    state = {
        editorState: BraftEditor.createEditorState()
    }

    handleChange = (editorState) => {
        this.setState({ editorState })
    }

    preview = () => {

        if (window.previewWindow) {
            window.previewWindow.close()
        }

        window.previewWindow = window.open()
        window.previewWindow.document.write(this.buildPreviewHtml())
        window.previewWindow.document.close()

    }

    buildPreviewHtml () {
        return `
      <!Doctype html>
      <html>
        <head>
          <title>预览内容</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.state.editorState.toHTML()}</div>
        </body>
      </html>
    `
    }



    render () {
        const props = {
            name: 'wordFile',
            action: '/api/app/article/upload',    //上传的地址
            headers: {
                authorization: 'authorization-text',
            },
            onChange:this.onChange
        };
        const { getFieldDecorator } = this.props.form
        const {submitData,onEditSubmit,onCloseModal} = this.props
        const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media' ,'emoji','code','clear','font-size','list-ul','list-ol','hr']
        const extendControls = [
            {
                key: 'custom-button',
                type: 'button',
                text: '预览',
                onClick: this.preview
            }
        ]
        let {imageUrl} = this.state;

        return (
            <div className="demo-container">
                <Form onSubmit={this.handleSubmit} onEditSubmit={()=>{this.addData()}} submitData = {submitData} onCloseModal={() => this.showEditModal(false)}>
                    <FormItem {...formItemLayout} label="文章标题">
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true,
                                message: '请输入标题',
                            }],
                        })(
                            <Input size="large" placeholder="请输入标题"/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label= "文章配图">
                        {getFieldDecorator('image', {
                            rules: [{
                                required: true
                            }],
                        })(
                            <div>
                                <Upload {...props}
                                     >

                                    <Button>
                                        <Icon type="upload" /> Click to Upload
                                    </Button>
                                </Upload>
                                <input type="hidden" value={imageUrl}/>
                            </div>
                        )}


                    </FormItem>
                    <FormItem {...formItemLayout} label="文章正文">
                        {getFieldDecorator('content', {
                            validateTrigger: 'onBlur',
                            rules: [{
                                required: true,
                                validator: (_, value, callback) => {
                                    if (value.isEmpty()) {
                                        callback('请输入正文内容')
                                    } else {
                                        callback()
                                    }
                                }
                            }],
                        })(
                            <BraftEditor
                                className="my-editor"
                                controls={controls}
                                placeholder="请输入正文内容"
                                onChange={this.handleChange}
                                extendControls={extendControls}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout}>
                        <Button size="large" type="primary" htmlType="submit">提交</Button>
                    </FormItem>
                </Form>
            </div>
        )

    }


}

export default Form.create()(AddArticle)