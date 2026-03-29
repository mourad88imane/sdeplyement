import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const ContactSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section className="py-20">
      <div className="w-full max-w-full px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">{t('contactUs')}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('contactSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {t('yourName')}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t('yourEmail')}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  {t('subject')}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  {t('message')}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('loading') : t('send')}
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-muted rounded-lg p-8"
          >
            <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-1">Address</h4>
                <p className="text-muted-foreground">
                  123 Education Avenue<br />
                  Academic City, AC 12345
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Phone</h4>
                <p className="text-muted-foreground">
                  Main Office: +1 (555) 123-4567<br />
                  Admissions: +1 (555) 987-6543
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Email</h4>
                <p className="text-muted-foreground">
                  General Inquiries: info@ecoleinternationale.edu<br />
                  Admissions: admissions@ecoleinternationale.edu
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Office Hours</h4>
                <p className="text-muted-foreground">
                  Monday - Friday: 8:00 AM - 5:00 PM<br />
                  Saturday: 9:00 AM - 1:00 PM (Admissions Only)
                </p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 h-48 bg-background rounded overflow-hidden">
              <img
                src="https://images.pexels.com/photos/2883380/pexels-photo-2883380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Campus location"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;