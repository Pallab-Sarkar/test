import { Router } from 'express'
const router = Router()
import { createBook, getAllList, getBookById, updateBook, deleteBook } from '../service/BookService.js'
import isAuthenticate from '../service/TokenService.js'
import customerLogger  from '../utils/logger.js'

// (CREATE BOOK) Creating new book
router.post('/create', isAuthenticate, (req,res) => {
    createBook(req, req.body).then(result => {
        res.status(200).json({ success: true, message: "Book created successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

// (GET ALL BOOKS) Fetching all books related information
router.post('/getAll', isAuthenticate, (req,res) => {
    getAllList(req, req.body).then(result => {
        res.status(200).json({ success: true, message: "Book list fetched successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

// (GET SINGLE BOOK) Fetching single book related information by its id
router.get('/:id', isAuthenticate, (req,res) => {

    getBookById(req.params.id).then(result => {
        res.status(200).json({ success: true, message: "Book fetched successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

// (UPDATE PARTICULAR BOOK) Updating single item into database 
router.put('/:id', isAuthenticate, (req,res) => {

    updateBook(req, req.body).then(result => {
        res.status(200).json({ success: true, message: "Book updated successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

//(DELETE PARTICULAR BOOK) Delete a book from database
router.delete('/:id', isAuthenticate ,(req,res) => {

    deleteBook(req, req.params.id).then(result => {
        res.status(200).json({ success: true, message: "Book deleted successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })

})

export default router