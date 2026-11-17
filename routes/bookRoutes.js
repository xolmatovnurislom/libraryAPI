const express = require("express")
const router = express.Router()
const bookController = require("../controllers/bookControllers")
const { authMiddleware } = require("../middlewares/authMiddleware")
const { roleMiddleware } = require("../middlewares/roleMiddleware")

router.get(
    "/books",
    bookController.getBook
)

router.get(
    "/books/count-author",
    bookController.getBooksByAuthor
)

router.get(
    "/books/count-by-author",
    bookController.getBooksCountByAuthor
)

router.get(
    "/books/total-pages",
    bookController.getBooksTotalPages
)

router.get(
    "/books/sort",
    bookController.sortBooksByPages
)

router.get(
    "/books/authors-only",
    bookController.getBooksAuthor
)

router.post(
    "/books",
    bookController.createBook
)

router.get(
    "/books/user-name",
    authMiddleware, roleMiddleware("admin"), bookController.getBooksWithUserName
)

router.get(
    "/books/:id",
    bookController.getBookById
)

router.put(
    "/books/:id",
    bookController.updateBook
)

router.delete(
    "/books/:id",
    authMiddleware, roleMiddleware("seller", "admin"),
    bookController.deleteBook
)

module.exports = router