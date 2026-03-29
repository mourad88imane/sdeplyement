import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { ContactAPI, ContactFormData } from '@/services/api';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static contact information
  const contactInfo = {
    address: 'École Nationale des Transmissions',
    city: 'Alger',
    country: 'Algerie',
    email: 'contact@ent-dz.com',
    phone: '+213 23 48 83 81',
    working_hours: lang === 'ar' ? 'الأحد - الخميس: 8:00 - 17:00' : lang === 'en' ? 'Sunday - Thursday: 8:00 AM - 5:00 PM' : 'Dimanche - Jeudi: 8h00 - 17h00'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await ContactAPI.submitContact(formData);
      if (response.success) {
        toast.success(lang === 'ar' ? 'تم إرسال رسالتك بنجاح' : lang === 'en' ? 'Your message has been sent successfully' : 'Votre message a été envoyé avec succès');
        setFormData({ name: '', email: '', subject: '', message: '', phone: '' });
      }
    } catch (error: any) {
      toast.error(error.message || (lang === 'ar' ? 'فشل في إرسال الرسالة' : lang === 'en' ? 'Failed to send message' : 'Échec de l\'envoi du message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border-2 border-blue/30 bg-white text-slate-900 text-base font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all shadow-sm";
  const selectClasses = "w-full px-4 py-3 rounded-xl border-2 border-blue/30 bg-white text-slate-900 text-base font-medium focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all shadow-sm cursor-pointer";
  const labelClasses = "block text-sm font-bold text-blue mb-3 uppercase tracking-widest";

  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* BACKGROUND DECORATIONS */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, rgba(19, 48, 89, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(232, 201, 122, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 100%, rgba(19, 48, 89, 0.05) 0%, transparent 80%)
          `,
        }}
      />

      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue via-gold to-blue opacity-30" />

      {/* HERO BANNER */}
      <section className="relative z-10 pt-24 pb-16 px-6 md:px-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue/20 bg-blue/5 backdrop-blur-sm hover:bg-blue/10 transition-colors mb-6"
          >
            <Mail className="w-4 h-4 text-gold animate-pulse" />
            <span className="text-blue text-xs font-bold uppercase tracking-widest">
              {lang === 'ar' ? '📧 تواصل معنا' : lang === 'en' ? '📧 Get in Touch' : '📧 Contactez-nous'}
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-blue leading-[1.15] mb-6">
            {lang === 'ar' ? 'اتصل بنا' : lang === 'en' ? 'Contact Us' : 'Contactez-nous'}
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-gold to-blue rounded-full mx-auto mb-6" />
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto">
            {lang === 'ar' 
              ? 'نحن هنا للإجابة على أسئلتك ومساعدتك. لا تتردد في التواصل معنا'
              : lang === 'en'
              ? 'We are here to answer your questions and help you. Feel free to reach out to us'
              : 'Nous sommes là pour répondre à vos questions et vous aider. N\'hésitez pas à nous contacter'}
          </p>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <section className="relative z-10 py-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-blue/10 p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-br from-blue/10 to-gold/10 rounded-lg">
                  <Mail className="h-5 w-5 text-blue" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-blue">
                  {lang === 'ar' ? 'أرسل لنا رسالة' : lang === 'en' ? 'Send us a message' : 'Envoyez-nous un message'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className={labelClasses}>
                      {lang === 'ar' ? 'الاسم الكامل' : lang === 'en' ? 'Full Name' : 'Nom complet'} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder={lang === 'ar' ? 'أدخل اسمك' : lang === 'en' ? 'Enter your name' : 'Entrez votre nom'}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      {lang === 'ar' ? 'البريد الإلكتروني' : lang === 'en' ? 'Email' : 'Email'} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClasses}
                      placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني' : lang === 'en' ? 'Enter your email' : 'Entrez votre email'}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className={labelClasses}>
                      {lang === 'ar' ? 'رقم الهاتف' : lang === 'en' ? 'Phone Number' : 'Téléphone'}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder={lang === 'ar' ? 'أدخل رقم هاتفك' : lang === 'en' ? 'Enter your phone' : 'Entrez votre téléphone'}
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className={labelClasses}>
                      {lang === 'ar' ? 'الموضوع' : lang === 'en' ? 'Subject' : 'Sujet'} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={selectClasses}
                    >
                      <option value="">{lang === 'ar' ? 'اختر الموضوع' : lang === 'en' ? 'Choose subject' : 'Choisir le sujet'}</option>
                      <option value="information">
                        {lang === 'ar' ? 'معلومات عامة' : lang === 'en' ? 'General Information' : 'Information générale'}
                      </option>
                      <option value="admission">
                        {lang === 'ar' ? 'التسجيل والقبول' : lang === 'en' ? 'Admission' : 'Inscription'}
                      </option>
                      <option value="formation">
                        {lang === 'ar' ? 'التكوين والتدريب' : lang === 'en' ? 'Training' : 'Formation'}
                      </option>
                      <option value="partnership">
                        {lang === 'ar' ? 'شراكة وتعاون' : lang === 'en' ? 'Partnership' : 'Partenariat'}
                      </option>
                      <option value="autre">
                        {lang === 'ar' ? 'أخرى' : lang === 'en' ? 'Other' : 'Autre'}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className={labelClasses}>
                    {lang === 'ar' ? 'الرسالة' : lang === 'en' ? 'Message' : 'Message'} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`${inputClasses} resize-none`}
                    placeholder={lang === 'ar' ? 'أدخل رسالتك...' : lang === 'en' ? 'Enter your message...' : 'Entrez votre message...'}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group w-full py-4 bg-gradient-to-r from-blue to-blue/80 hover:from-blue-dark hover:to-blue text-white font-bold rounded-xl shadow-lg hover:shadow-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {lang === 'ar' ? 'جاري الإرسال...' : lang === 'en' ? 'Sending...' : 'Envoi en cours...'}
                    </>
                  ) : (
                    <>
                      {lang === 'ar' ? 'إرسال الرسالة' : lang === 'en' ? 'Send Message' : 'Envoyer le message'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Info Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-blue/10 p-8"
              >
                <h2 className="text-2xl font-serif font-bold text-blue mb-8">
                  {lang === 'ar' ? 'معلومات الاتصال' : lang === 'en' ? 'Contact Information' : 'Informations de contact'}
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <motion.div whileHover={{ x: 8 }} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue/10 to-gold/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all">
                      <MapPin className="w-6 h-6 text-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue mb-1 uppercase tracking-widest text-sm">
                        {lang === 'ar' ? 'العنوان' : lang === 'en' ? 'Address' : 'Adresse'}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {contactInfo.address}<br />
                        {contactInfo.city}, {contactInfo.country}
                      </p>
                    </div>
                  </motion.div>

                  {/* Phone */}
                  <motion.div whileHover={{ x: 8 }} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/10 to-blue/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all">
                      <Phone className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue mb-1 uppercase tracking-widest text-sm">
                        {lang === 'ar' ? 'الهاتف' : lang === 'en' ? 'Phone' : 'Téléphone'}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {contactInfo.phone}
                      </p>
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div whileHover={{ x: 8 }} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue/10 to-gold/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all">
                      <Mail className="w-6 h-6 text-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue mb-1 uppercase tracking-widest text-sm">
                        {lang === 'ar' ? 'البريد الإلكتروني' : lang === 'en' ? 'Email' : 'Email'}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {contactInfo.email}
                      </p>
                    </div>
                  </motion.div>

                  {/* Working Hours */}
                  <motion.div whileHover={{ x: 8 }} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue/10 to-gold/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all">
                      <Clock className="w-6 h-6 text-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue mb-1 uppercase tracking-widest text-sm">
                        {lang === 'ar' ? 'ساعات العمل' : lang === 'en' ? 'Working Hours' : 'Heures de travail'}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {contactInfo.working_hours}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Why Contact Us */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-r from-blue to-blue/80 rounded-2xl shadow-xl p-8 text-white border border-gold/30"
              >
                <h3 className="text-xl font-serif font-bold mb-6">
                  {lang === 'ar' ? 'لماذا تتواصل معنا؟' : lang === 'en' ? 'Why Contact Us?' : 'Pourquoi nous contacter?'}
                </h3>
                <ul className="space-y-4">
                  <motion.li 
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-gold rounded-full" />
                    </div>
                    <span className="text-sm">{lang === 'ar' ? 'إجابات سريعة على استفساراتك' : lang === 'en' ? 'Quick answers to your inquiries' : 'Réponses rapides à vos questions'}</span>
                  </motion.li>
                  <motion.li 
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-gold rounded-full" />
                    </div>
                    <span className="text-sm">{lang === 'ar' ? 'دعم فني متواصل' : lang === 'en' ? 'Continuous technical support' : 'Support technique continu'}</span>
                  </motion.li>
                  <motion.li 
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-gold rounded-full" />
                    </div>
                    <span className="text-sm">{lang === 'ar' ? 'معلومات شاملة عن برامجنا' : lang === 'en' ? 'Comprehensive information about our programs' : 'Informations complètes sur nos programmes'}</span>
                  </motion.li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue/20 rounded-full blur-3xl pointer-events-none opacity-20" />
    </div>
  );
};

export default ContactPage;
