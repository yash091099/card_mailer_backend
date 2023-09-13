const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

app.post('/sendCard', async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, address,sender } = req.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  

    const content = `
    <div class="card">
      <h1>${firstName} ${lastName}</h1>
      <div class="contact">
        <p>Email: ${email}</p>
        <p>Mobile: ${mobile}</p>
      </div>
      <p>Address: ${address}</p>
    </div>
  `;

  const css = `
    .card {
      background: radial-gradient(circle at -8.9% 51.2%, rgb(255, 124, 0) 0%, rgb(255, 124, 0) 15.9%, rgb(255, 163, 77) 15.9%, rgb(255, 163, 77) 24.4%, rgb(19, 30, 37) 24.5%, rgb(19, 30, 37) 66%);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.1);
      text-align: left;
      color: white;
    }

    .card h1 {
      text-align: center;
    }

    .card p {
      margin: 0; 
      line-height: 1.5; 
    }

    .card span {
      font-weight: bold; 
    }

    .card .contact {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card .contact p {
      margin-right: 10px;
    }
  `;

  await page.setContent(`<style>${css}</style>${content}`);
    const pdfBuffer = await page.pdf();
    await browser.close();
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'yash@ith.tech',
        pass: 'mhtzdwpcixetmvlx',
      },
    });

    const mailOptions = {
      from: 'yash@ith.tech',
      to: sender,
      subject: 'Your Awesome Card',
      text: 'Attached is your awesome profile card!',
      attachments: [
        {
          filename: 'card.pdf',
          content: pdfBuffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Card sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

