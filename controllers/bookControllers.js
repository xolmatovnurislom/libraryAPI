const Book = require("../models/Books")

exports.getBook = async (req, res) => {
    try {
        const books = await Book.find()
        res.json(books)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        if (!book) {
           return res.status(404).send("Kitob topilmadi!")
        }

        res.status(200).json(book)

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getBooksByAuthor = async (req, res) => {
    try {
        const books = await Book.aggregate([
            {$match:{author: "Abdulla Qodiriy"}},
            {$count: "jamiKitoblar"}
        ])

        res.status(200).json(books)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getBooksCountByAuthor = async (req, res) => {
    try {
        const books = await Book.aggregate([
            {$group:{
                _id: "$author",
                totalBooks: {$sum: 1}
            }},
        ])

        res.status(200).json(books)

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getBooksTotalPages = async (req, res) => {
    try {
        const book = await Book.aggregate([
            {$group: {
                _id: null,
                totalPages: {$sum: "$pages"}
            }}
        ])

        res.status(200).json(book)

    } catch (error) {
        res.status(500).send(error)
    }
    
}

exports.sortBooksByPages = async (req, res) => {
    try {
      const books = await Book.aggregate([
        { $sort: {pages: -1}}
      ])

      res.status(200).json(books)

    } catch (error) {
      res.status(500).send(error)
    }
}

exports.getBooksAuthor = async (req, res) => {
    try {
         const authors = await Book.aggregate([
            {$project: {
                _id: 0,
                author: 1
            }}
        ])

        res.status(200).json(authors)

    } catch (error) {
        res.status(500).send(error)
    }
}

exports.getBooksWithUserName = async (req, res) => {
    try {
        const books = await Book.find().populate("user", "name")
        res.status(200).json(books)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.createBook = async (req, res) => {
    try {
        const book = await Book.create(req.body)
        res.status(201).json(book)
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        
        if (!book) {
            return res.status(404).send("Kitob topilmadi!")
        }

        res.status(200).json(book)
        
    } catch (error) {
        res.status(500).send(error)
    }
}

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)

        if (!book) {
            return res.status(404).send("Kitob topilmadi!")
        }

        res.status(200).send("Kitob o'chirildi!")
    } catch (error) {
        res.status(500).send(error)
    }
}