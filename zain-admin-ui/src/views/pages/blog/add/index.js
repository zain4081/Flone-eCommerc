import { useState, useEffect } from 'react'
import Select from 'react-select'
import htmlToDraft from 'html-to-draftjs'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState } from 'draft-js'
import Breadcrumbs from '@components/breadcrumbs'
import { selectThemeColors } from '@utils'
import { Row, Col, Card, CardBody, Form, Label, Input, Button } from 'reactstrap'
import '@styles/react/libs/editor/editor.scss'
import '@styles/base/plugins/forms/form-quill-editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/base/pages/page-blog.scss'
import axiosInstance from '../../../../interceptor/axios'
import { useParams } from 'react-router-dom'
import Dropzone, { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogAdd = () => {
    const notify = (msg) => toast(msg);

  
    // ** States
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])
    const [postForm, setPostForm] = useState({
      title: '',
      category: null,
      tags: [],
      top: false,
      featured: false,
      content: EditorState.createEmpty(),
    })
    const [featuredImg, setFeaturedImg] = useState('')
    const [image, setImage] = useState('')
  
    useEffect(() => {
      axiosInstance.get(`/blog/categories`).then(res => {
        setCategories(res.data)
      }).catch(error => {
        console.error('Error fetching categories:', error)
      })
  
      axiosInstance.get(`/blog/tags`).then(res => {
        setTags(res.data)
      }).catch(error => {
        console.error('Error fetching tags:', error)
      })
    }, [])
  
    const handleInputChange = (e) => {
      const { name, value } = e.target
      setPostForm(prevState => ({
        ...prevState,
        [name]: value
      }))
    }
  
    const handleCategoryChange = (selectedCategory) => {
      setPostForm(prevState => ({
        ...prevState,
        category: selectedCategory
      }))
    }
  
    const handleTagsChange = (selectedTags) => {
      setPostForm(prevState => ({
        ...prevState,
        tags: selectedTags
      }))
    }
  
    const handleEditorChange = (editorState) => {
      setPostForm(prevState => ({
        ...prevState,
        content: editorState
      }))
    }
  
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target
      setPostForm(prevState => ({
        ...prevState,
        [name]: checked
      }))
    }
  
  
    const onDrop = (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = function () {
        setFeaturedImg(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file)
      console.log("image", image)
    };
  
    const handleCreate = async (e) => {
      e.preventDefault();
      try {
        const bodyData = {
          title: postForm.title,
          category: postForm.category.id,
          tags: postForm.tags.map(tag => tag.id),
          top: postForm.top,
          featured: postForm.featured,
          content: postForm.content.getCurrentContent().getPlainText(),
        };
    
        if (image && image !== '') {
          bodyData.image = image;
        }
        console.log("c_image", image)
        const res = await axiosInstance.post(`/blog/posts/`, bodyData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        if(res.status === 201){
          notify("Post created Successfully");
          setPostForm({
            title: '',
            category: null,
            tags: [],
            top: false,
            featured: false,
            content: EditorState.createEmpty(),
          });
          setFeaturedImg('');
          setImage('');
        }
        // Optionally, redirect or show a success message
      } catch (error) {
        console.error('Error creating blog post:', error);
        // Handle error, e.g., show an error message
      }
    };
  return (
    <div className='blog-edit-wrapper'>
      <Breadcrumbs title='Blog Edit' data={[{ title: 'Pages' }, { title: 'Blog' }, { title: 'Edit' }]} />
      <ToastContainer />
        <Row>
          <Col sm='12'>
            <Card>
              <CardBody>
                <Form className='mt-2' onSubmit={handleCreate}>
                  <Row>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-title'>
                        Title
                      </Label>
                      <Input id='blog-edit-title' name='title' value={postForm.title} onChange={handleInputChange} />
                    </Col>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-category'>
                        Category
                      </Label>
                      <Select
                        id='blog-edit-category'
                        isClearable={false}
                        theme={selectThemeColors}
                        value={categories.find(cat => cat.id === postForm.category)}
                        options={categories}
                        className='react-select'
                        classNamePrefix='select'
                        getOptionLabel={option => option.name}
                        getOptionValue={option => option.id}
                        onChange={handleCategoryChange}
                      />
                    </Col>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-tags'>
                        Tags
                      </Label>
                      <Select
                        id='blog-edit-tags'
                        isMulti
                        theme={selectThemeColors}
                        value={postForm.tags}
                        options={tags}
                        className='react-select'
                        classNamePrefix='select'
                        getOptionLabel={option => option.name}
                        getOptionValue={option => option.id}
                        onChange={handleTagsChange}
                      />
                    </Col>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-top'>
                        Top
                      </Label>
                      <Input
                        type='checkbox'
                        id='blog-edit-top'
                        name='top'
                        checked={postForm.top}
                        onChange={handleCheckboxChange}
                      />
                    </Col>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-featured'>
                        Featured
                      </Label>
                      <Input
                        type='checkbox'
                        id='blog-edit-featured'
                        name='featured'
                        checked={postForm.featured}
                        onChange={handleCheckboxChange}
                      />
                    </Col>
                    <Col sm='12' className='mb-2'>
                      <Label className='form-label'>Content</Label>
                      <Editor editorState={postForm.content} onEditorStateChange={handleEditorChange} />
                    </Col>
                    <Col className='mb-2' sm='12'>
                      <div className='border rounded p-2'>
                        <h4 className='mb-1'>Image</h4>
                        <div className='d-flex flex-column flex-md-row'>
                          <img
                            className='rounded me-2 mb-1 mb-md-0'
                            src={featuredImg}
                            alt='featured img'
                            width='170'
                            height='110'
                          />
                          <div>
                          <Dropzone onDrop={onDrop}>
                              {({ getRootProps, getInputProps }) => (
                                <div className='d-inline-block'>
                                  <div className='dropzone' {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p className='dropzone-placeholder'>
                                        Drag and drop or click to select files
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col className='mt-50'>
                      <Button color='primary' className='me-1'>
                        Save Changes
                      </Button>
                      <Button color='secondary' outline>
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
    </div>
  )
}

export default BlogAdd;
