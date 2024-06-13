import { Fragment, useState, useEffect } from 'react'
import classnames from 'classnames'
import {
  Share2,
  GitHub,
  Gitlab,
  Twitter,
  Bookmark,
  Facebook,
  Linkedin,
  CornerUpLeft,
  MessageSquare,
  Trash2
} from 'react-feather'
import { kFormatter } from '@utils'
import Sidebar from '../BlogSidebar'
import Avatar from '@components/avatar'
import Breadcrumbs from '@components/breadcrumbs'
import {
  Row,
  Col,
  Card,
  Form,
  Badge,
  Input,
  Label,
  Button,
  CardImg,
  CardBody,
  CardText,
  CardTitle,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'
import '@styles/base/pages/page-blog.scss'
import cmtImg from '@src/assets/images/portrait/small/avatar-s-6.jpg'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../../interceptor/axios'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogDetails = () => {
  const [data, setData] = useState(null)
  const [comments, setComments] = useState(null)
  const [open, setOpen] = useState(false)
  const { id } = useParams()
  const nav = useNavigate()
  
  useEffect(() => {
    const fetchData = async (postId) => {
      try {
        const response = await axiosInstance.get(`/blog/posts/${postId}`)
        setData(response.data)
      } catch (error) {
        nav("/pages/blog/list")
        console.error("Error fetching data:", error)
      }
    }

    const fetchComments = async (postId) => {
      try {
        const response = await axiosInstance.get(`/blog/posts/${postId}/comments`)
        setComments(response.data.comments)
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }

    fetchData(id)
    fetchComments(id)
  }, [id, nav])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/blog/posts/${id}`)
      nav("/pages/blog/list")
      if(res.status == 204){
        toast.success('Post deleted successfully!')
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    } finally {
      handleClose()
    }
  }

  const badgeColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  }

  const renderTags = () => {
    return data.tags_name.map((tag, index) => (
      <a key={index} href='/' onClick={e => e.preventDefault()}>
        <Badge
          className={classnames({ 'me-50': index !== data.tags_name.length - 1 })}
          color={badgeColorsArr[tag]}
          pill
        >
          {tag}
        </Badge>
      </a>
    ))
  }

  const renderComments = () => {
    return comments && comments.map(comment => (
      <Card className='mb-3' key={comment.id}>
        <CardBody>
          <div className='d-flex'>
            <div>
              <Avatar className='me-75' img={comment.user_name} imgHeight='38' imgWidth='38' />
            </div>
            <div>
              <h6 className='fw-bolder mb-25'>{comment.user_name}</h6>
              <CardText>{comment.date}</CardText>
              <CardText>{comment.content}</CardText>
              <a href='/' onClick={e => e.preventDefault()}>
                <div className='d-inline-flex align-items-center'>
                  <CornerUpLeft size={18} className='me-50' />
                  <span>Reply</span>
                </div>
              </a>
            </div>
          </div>
        </CardBody>
      </Card>
    ))
  }

  return (
    <Fragment>
      <Breadcrumbs title='Blog Details' data={[{ title: 'Pages' }, { title: 'Blog' }, { title: 'Details' }]} />
      <ToastContainer />
      <div className='blog-wrapper'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            {data !== null ? (
              <Row>
                <Col sm='12'>
                  <Card className='mb-3'>
                    <CardImg src={import.meta.env.VITE_API_URL + data.image_url} className='img-fluid' top />
                    <CardBody>
                      <CardTitle tag='h4'>{data.title}</CardTitle>
                      <div className='my-1 py-25'>{renderTags()}</div>
                      <div
                        dangerouslySetInnerHTML={{ __html: data.content }}
                      ></div>
                      <div className='d-flex'>
                        <div>
                          <Avatar img={cmtImg} className='me-2' imgHeight='60' imgWidth='60' />
                        </div>
                        <div>
                          <h6 className='fw-bolder'>Willie Clark</h6>
                          <CardText className='mb-0'>
                            Based in London, Uncode is a blog by Willie Clark. His posts explore modern design trends
                            through photos and quotes by influential creatives and web designer around the world.
                          </CardText>
                        </div>
                      </div>
                      <hr className='my-2' />
                      <div className='d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
                          <div className='d-flex align-items-center me-1'>
                            <a className='me-50' href='/' onClick={e => e.preventDefault()}>
                              <MessageSquare size={21} className='text-body align-middle' />
                            </a>
                            <a href='/' onClick={e => e.preventDefault()}>
                              <div className='text-body align-middle'>{kFormatter(data.comments_count)}</div>
                            </a>
                          </div>
                          <Link className='fw-bold' to={`/pages/blog/edit/${data.id}`}>
                            Edit
                          </Link>
                          <Button color='danger' className='ms-1' onClick={handleClickOpen}>
                            <Trash2 size={18} className='align-middle' />
                            <span className='align-middle ms-1'>Delete</span>
                          </Button>
                          <div className='d-flex align-items-center'>
                            <a className='me-50' href='/' onClick={e => e.preventDefault()}>
                              <Bookmark size={21} className='text-body align-middle' />
                            </a>
                            <a href='/' onClick={e => e.preventDefault()}>
                              <div className='text-body align-middle'>{data.bookmarked}</div>
                            </a>
                          </div>
                        </div>
                        <UncontrolledDropdown className='dropdown-icon-wrapper'>
                          <DropdownToggle tag='span'>
                            <Share2 size={21} className='text-body cursor-pointer' />
                          </DropdownToggle>
                          <DropdownMenu end>
                            <DropdownItem className='py-50 px-1'>
                              <GitHub size={18} />
                            </DropdownItem>
                            <DropdownItem className='py-50 px-1'>
                              <Gitlab size={18} />
                            </DropdownItem>
                            <DropdownItem className='py-50 px-1'>
                              <Facebook size={18} />
                            </DropdownItem>
                            <DropdownItem className='py-50 px-1'>
                              <Twitter size={18} />
                            </DropdownItem>
                            <DropdownItem className='py-50 px-1'>
                              <Linkedin size={18} />
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm='12' id='blogComment'>
                  <h6 className='section-label'>Comment</h6>
                  {renderComments()}
                </Col>
                <Col sm='12'>
                  <h6 className='section-label'>Leave a Comment</h6>
                  <Card>
                    <CardBody>
                      <Form className='form' onSubmit={e => e.preventDefault()}>
                        <Row>
                          <Col sm='6'>
                            <div className='mb-2'>
                              <Input placeholder='Name' />
                            </div>
                          </Col>
                          <Col sm='6'>
                            <div className='mb-2'>
                              <Input type='email' placeholder='Email' />
                            </div>
                          </Col>
                          <Col sm='6'>
                            <div className='mb-2'>
                              <Input type='url' placeholder='Website' />
                            </div>
                          </Col>
                          <Col sm='12'>
                            <div className='mb-2'>
                              <Input className='mb-2' type='textarea' rows='4' placeholder='Comment' />
                            </div>
                          </Col>
                          <Col sm='12'>
                            <div className='form-check mb-2'>
                              <Input type='checkbox' id='save-data-checkbox' />
                              <Label className='form-check-label' for='save-data-checkbox'>
                                Save my name, email, and website in this browser for the next time I comment.
                              </Label>
                            </div>
                          </Col>
                          <Col sm='12'>
                            <Button color='primary'>Post Comment</Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ) : null}
          </div>
        </div>
        <Sidebar />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default BlogDetails
