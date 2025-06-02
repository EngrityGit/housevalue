import express, { Request, Response, RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
// import OpenAI from "openai";
// import { Resend } from "resend";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL || "https://pogytcpdpktziiapxihh.supabase.co",
  process.env.SUPABASE_ANON_KEY!
);

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const resend = new Resend(process.env.RESEND_API_KEY);

// Define the route handler with proper typing
const createLead: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      address,
      firstName,
      lastName,
      email,
      phone,
      consent,
      bedrooms,
      bathrooms,
      basement,
      basementStatus,
      sellingTimeline,
      propertyType,
      unitNumber,
    } = req.body;

    if (
      !address || !firstName || !lastName || !email ||
      !phone || consent === undefined
    ) {
      res.status(400).json({ error: "Missing required fields or consent" });
      return;
    }

    // Check if lead with this email already exists
    // const { data: existingLead, error: fetchError } = await supabase
    //   .from("leads")
    //   .select("id")
    //   .eq("email", email)
    //   .single();

    // if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 = no rows found, safe to ignore
    //   res.status(500).json({ error: fetchError.message });
    //   return;
    // }

    // if (existingLead) {
    //   // Lead already exists, do NOT update, return conflict error or just inform user
    //   res.status(409).json({ error: "Lead with this email already exists." });
    //   return;
    // }

    // Insert new lead since none found
    const { data, error } = await supabase
      .from("leads")
      .insert({
        address,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        consent,
        bedrooms,
        bathrooms,
        basement,
        basement_status: basementStatus,
        selling_timeline: sellingTimeline,
        apartment_type: propertyType,
        unit_number: unitNumber,
      })
      .select();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Generate AI estimation prompt
//     const prompt = `
// You are a smart real estate AI. Estimate the potential value of a house based on the following:

// Address: ${address}
// Bedrooms: ${bedrooms}
// Bathrooms: ${bathrooms}
// Basement: ${basement}
// Basement Status: ${basementStatus}
// Selling Timeline: ${sellingTimeline}
// Apartment Type: ${propertyType}
// Unit Number: ${unitNumber}

// Provide a short, professional 2-3 sentence summary with a price range. Keep it realistic.
//     `;

//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const estimation = aiResponse.choices[0].message.content?.trim() || "Estimation unavailable.";

//     // Send email with Resend
//     await resend.emails.send({
//       from: process.env.RESEND_FROM || "prathik.jeyakumar@engrity.com",
//       to: email,
//       bcc: process.env.ADMIN_EMAIL,
//       subject: "🏡 Your Home Value Estimation Report",
//       html: `
// <div style="font-family: Arial, sans-serif; padding: 24px; background: #f8fafc; color: #111">
//   <h1 style="color: #0071fe;">Hey ${firstName},</h1>
//   <p>Thanks for submitting your property details. Here's an AI-generated estimation based on your input:</p>

//   <div style="background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin: 20px 0;">
//     <h2 style="color: #111;">🏠 Estimation Summary</h2>
//     <p>${estimation}</p>
//   </div>

//   <hr style="border: none; border-top: 1px solid #ddd; margin: 32px 0;" />

//   <h3>🔍 Your Submitted Info</h3>
//   <ul>
//     <li><strong>Address:</strong> ${address}</li>
//     <li><strong>Name:</strong> ${firstName} ${lastName}</li>
//     <li><strong>Email:</strong> ${email}</li>
//     <li><strong>Phone:</strong> ${phone}</li>
//     <li><strong>Bedrooms:</strong> ${bedrooms}</li>
//     <li><strong>Bathrooms:</strong> ${bathrooms}</li>
//     <li><strong>Basement:</strong> ${basement}</li>
//     <li><strong>Basement Status:</strong> ${basementStatus}</li>
//     <li><strong>Apartment Type:</strong> ${propertyType}</li>
//     <li><strong>Unit Number:</strong> ${unitNumber}</li>
//     <li><strong>Timeline:</strong> ${sellingTimeline}</li>
//   </ul>

//   <p style="margin-top: 32px;">Let us know if you'd like to speak to an agent or get a full appraisal!</p>
//   <p style="font-size: 14px; color: #555;">This is an automated estimation and not an official appraisal.</p>

//   <footer style="margin-top: 40px; font-size: 12px; color: #aaa;">
//     © ${new Date().getFullYear()} Your Company. All rights reserved.
//   </footer>
// </div>
//       `,
//     });

    res.status(201).json({ message: "Lead created and email sent successfully!" });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/", createLead);

export default router;