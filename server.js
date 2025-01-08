import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const url = 'mongodb://127.0.0.1:27017/employeeData';

mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}).catch((err) => {
    console.log(err, "Error connecting to MongoDB");
})

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    salary: { type: Number, required: true }
})

const Employee = mongoose.model('Employee', employeeSchema);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile('index.html');
    // const data = req.body;
})


app.post('/add', async (req, res) => {
    const data = req.body;
    console.log(data, "Employee Data");
    const employee = new Employee(data);
    await employee.save();
    res.send("Data added successfully");
});


app.get('/data', async (req, res) => {
    const data = await Employee.find();
    res.render('index.ejs', { data });

})

app.post('/edit-or-dlt', async (req, res) => {
    const { id, name, age, salary, action } = req.body;

    if (action === 'edit') {
        await Employee.findByIdAndUpdate(id, { name, age, salary }, { new: true });
        res.redirect('/data');
    } else if (action === 'delete') {
        await Employee.findByIdAndDelete(id);
        res.redirect('/data');
    } else {
        res.status(400).send("Invalid action");
    }
});