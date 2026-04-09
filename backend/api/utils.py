import os
import matplotlib.pyplot as plt
from django.conf import settings

def save_plot(plot_img_path):
    image_path = os.path.join(settings.MEDIA_ROOT, plot_img_path)
    if not os.path.exists(settings.MEDIA_ROOT):
        os.makedirs(settings.MEDIA_ROOT)
    plt.savefig(image_path)
    plt.close() 
    img_url = settings.MEDIA_URL + plot_img_path
    return img_url