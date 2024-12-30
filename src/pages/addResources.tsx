import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { AddResourceData, AddResourceResponse } from './types'; // Adjust the import path as necessary
import { useState } from 'react';

const addResource = async (resourceData: AddResourceData): Promise<AddResourceResponse> => {
    try {
        const response = await fetch('/api/add-resource', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resourceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add resource');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding resource:', error);
        throw error;
    }
};

// AddResourceForm component
const AddResourceForm: React.FC<{ onResourceAdded: () => void }> = ({ onResourceAdded }) => {
    const [formData, setFormData] = useState<AddResourceData>({
        title: '',
        link: '',
        category: '',
        description: '',
        user_id: '1' // You might want to get this from your auth system
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
        type: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await addResource(formData);
            setStatus({ type: 'success', message: response.message });
            setFormData({
                title: '',
                link: '',
                category: '',
                description: '',
                user_id: '1'
            });
            onResourceAdded(); // Refresh the resources list
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error instanceof Error ? error.message : 'Failed to add resource'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Resource</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Resource title"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Link</label>
                        <Input
                            required
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="Resource link"
                            type="url"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Resource category"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Resource description"
                        />
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Resource'}
                    </Button>

                    {status.message && (
                        <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                            <AlertDescription>{status.message}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export { AddResourceForm, addResource };