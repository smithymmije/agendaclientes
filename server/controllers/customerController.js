/*const customer = require('../models/customer');*/
const Customer = require('../models/customer');
const mongoose = require('mongoose');


/**
 * GET /
 * Homepage
 */

exports.homepage = async (req, res) => {
    const messages = req.flash('info'); // Recupera mensagens flash

    const locals = {
        title: 'NodeJs',
        description: 'Sistema de gerenciamento de usuários em NodeJs'
    }

    let perPage = 8;
    let page = req.query.page || 1;

    try {
        const customers = await Customer.aggregate([{ $sort: { updatedAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
            const count = await Customer.countDocuments();

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages
        });

    } catch (error) {
        console.log(error);
    }
}


//exports.homepage = async (req, res) => {
//  const messages = req.flash('info'); // Recupera mensagens flash
//
//  const locals = {
//        title: 'NodeJs',
//        description: 'Free NodeJs User Management System'
//    }
//
//    try {
//        const customers = await Customer.find({}).limit(22);
//        res.render('index', { locals, messages, customers });
//    } catch (error) {
//        console.log(error);
//    }
//}

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
    const locals = {
        title: 'Sobre',
        description: 'Sistema de gerenciamento de usuários em NodeJs'
    }

    try {
        res.render('about', locals );
    } catch (error) {
        console.log(error);
    }
}


/**
 * GET /
 * New Customer Form
 */
exports.addCustomer = async (req, res) => {
    const locals = {
        title: 'Add Novo Cliente - NodeJs',
        description: 'Sistema de gerenciamento de usuários em NodeJs'
    }
    res.render('customer/add', locals);
}

/**
 * POST /
 * Create New Customer
 */
exports.postCustomer = async (req, res) => {
    console.log(req.body);

    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        details: req.body.details,
        tel: req.body.tel,
        email: req.body.email
    });

    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'Novo cliente adicionado com sucesso.')
        res.redirect('/');    
    } catch (error) {
        console.log(error);
    }
    
}


/**
 * GET /
 * Customer Data
 */
exports.view = async (req, res) => {

    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: "Visualizar Informações do Cliente",
            description: "Sistema de gerenciamento de usuários em NodeJs",
        };

        res.render('customer/view', {
            locals,
            customer
        })

    } catch (error) {
        console.log(error);
    }
}

/**
 * GET /
 * Customer Edit
 */
exports.edit = async (req, res) => {

    try {
        const customer = await Customer.findOne({ _id: req.params.id })

        const locals = {
            title: "Editar Informações do Cliente",
            description: "Sistema de gerenciamento de usuários em NodeJs",
        };

        res.render('customer/edit', {
            locals,
            customer
        })

    } catch (error) {
        console.log(error);
    }
}


/**
 * GET /
 * Update EditPOST
 */
exports.editPost = async (req, res) => {
    try {
      await Customer.findOneAndUpdate(
        { _id: req.params.id }, // Filtro correto
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          tel: req.body.tel,
          email: req.body.email,
          details: req.body.details,
          updatedAt: Date.now()
        }
      );
  
      res.redirect(`/edit/${req.params.id}`);
      console.log('redirected');
      
    } catch (error) {
      console.log(error);
    }
  };

/**
 * Delete /
 * Delete Customer Data
 */
exports.deleteCustomer = async (req, res) => {

    try {
        await Customer.deleteOne({ _id: req.params.id });
        res.redirect("/");
      } catch (error) {
        console.log(error);
      }
      


  };


/**
 * Search /
 * Search Customer Data
 */
exports.searchCustomers = async (req, res) => {

    const locals = {
        title: "Pesquisar Cliente",
        description: "Sistema de gerenciamento de usuários em NodeJs"
      };
      


    try {
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
      const customers = await Customer.find({
        $or: [
          { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") }},
          { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") }},
        ]
      });

      res.render("search", {
        customers,
        locals
      })


    } catch (error) {
        console.log(error);
    }
  };
  
/**
 * POST /appointments
 * Cria agendamento vindo do modal
 */
exports.createAppointment = async (req, res) => {
    try {
      // Remove _id vazio para evitar erro de cast
      if (!req.body._id) delete req.body._id;
  
      console.log('[APPOINTMENT BODY]', req.body);
      await Customer.create(req.body);
      res.json({ ok: true });
    } catch (e) {
      console.error('[APPOINTMENT ERROR]', e);
      res.status(400).json({ error: e.message });
    }
  };

 /**
 * GET /appointments/json
 * Devolve eventos para o FullCalendar
 */
 exports.getAppointmentsJson = async (req, res) => {
    try {
      const data = await Customer.find({ date: { $exists: true } }, '-__v').lean();
      const events = data.map(a => ({
        id    : a._id,
        title : `${a.clientName} - ${a.service}`,
        start : `${a.date.toISOString().slice(0,10)}T${a.time}:00`,   // segundos OK
        end   : `${a.date.toISOString().slice(0,10)}T${a.time}:00`,
        color : a.status === 'confirmado' ? '#28a745' :
                a.status === 'cancelado'  ? '#dc3545' : '#007bff'
      }));
      res.json(events);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };