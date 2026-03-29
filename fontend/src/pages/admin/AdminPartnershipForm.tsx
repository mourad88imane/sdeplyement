import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Partnership, PartnershipFormData } from '@/data/PartnershipTypes';
import { partnershipService } from '@/services/PartnershipService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';


const AdminPartnershipForm = () => {
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<PartnershipFormData>({
    name: '',
    logo: null,
    website: '',
    description: '',
  });

  const [currentPartnership, setCurrentPartnership] = useState<Partnership | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      fetchPartnership(parseInt(id));
    }
  }, [id, isEditing]);

  const fetchPartnership = async (partnershipId: number) => {
    try {
      const partnership = await partnershipService.getById(partnershipId);
      setCurrentPartnership(partnership);
      setFormData({
        name: partnership.name,
        logo: null, // Keep null for file input
        website: partnership.website || '',
        description: partnership.description || '',
      });
      setLogoPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${partnership.logo}`);
    } catch (err) {
      setError('Failed to load partnership');
      console.error('Error fetching partnership:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      logo: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (!isEditing) {
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Partnership name is required');
      return;
    }

    if (!formData.logo && !isEditing) {
      setError('Logo is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditing && id) {
        await partnershipService.update(parseInt(id), formData);
      } else {
        await partnershipService.create(formData);
      }
      navigate('/admin/partners');
    } catch (err) {
      setError(isEditing ? 'Failed to update partnership' : 'Failed to create partnership');
      console.error('Error saving partnership:', err);
    } finally {
      setSaving(false);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
    }));
    if (!isEditing) {
      setLogoPreview(null);
    } else {
      setLogoPreview(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${currentPartnership?.logo}`);
    }
    // Reset file input
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="w-full max-w-2xl mx-auto px-6 rtl:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/partners')}>
            <ArrowLeft className="mr-2 rtl:mr-0 rtl:ml-2 h-4 w-4" />
            Back to Partnerships
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Edit Partnership' : 'Create Partnership'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update partnership information' : 'Add a new partnership'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Partnership Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter partnership name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter partnership description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo *</Label>
            <div className="space-y-4">
              {/* Logo Preview */}
              {logoPreview && (
                <div className="relative inline-block">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-32 h-32 object-contain border border-border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* File Input */}
              <div className="flex items-center gap-4">
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label
                  htmlFor="logo"
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </Label>
                {!isEditing && !logoPreview && (
                  <span className="text-sm text-muted-foreground">Logo is required</span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving...' : (isEditing ? 'Update Partnership' : 'Create Partnership')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/partners')}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AdminPartnershipForm;